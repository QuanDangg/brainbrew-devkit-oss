#!/usr/bin/env node

/**
 * Download all attachments from a Jira issue to .jira/{issue_key}/attachments/.
 *
 * Usage: node save-attachments.cjs <issue_key>
 *
 * Reads JIRA_URL and JIRA_PERSONAL_TOKEN from .mcp.json (mcp-atlassian env),
 * queries Jira REST API for the issue's attachment list, then downloads each.
 *
 * Prints JSON result: { issue_key, saved: [paths], failed: [{filename, error}] }
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const [, , issueKey] = process.argv;

if (!issueKey) {
  console.error('Usage: node save-attachments.cjs <issue_key>');
  process.exit(1);
}

function loadMcpConfig() {
  const candidates = [
    path.join(process.cwd(), '.mcp.json'),
    path.join(process.cwd(), '.claude', 'mcp.json'),
    path.join(process.env.HOME || '', '.claude', 'mcp-servers.json'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
      const env = cfg?.mcpServers?.['mcp-atlassian']?.env;
      if (env?.JIRA_URL && env?.JIRA_PERSONAL_TOKEN) return env;
    }
  }
  throw new Error('JIRA_URL/JIRA_PERSONAL_TOKEN not found in .mcp.json');
}

function request(urlStr, token, rejectUnauthorized, binary) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request(
      {
        method: 'GET',
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: u.pathname + u.search,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: binary ? '*/*' : 'application/json',
        },
        rejectUnauthorized,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location, token, rejectUnauthorized, binary).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${urlStr}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          resolve(binary ? buf : JSON.parse(buf.toString('utf8')));
        });
        res.on('error', reject);
      }
    );
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    const env = loadMcpConfig();
    const sslVerify = env.JIRA_SSL_VERIFY !== 'false';
    const base = env.JIRA_URL.replace(/\/$/, '');

    const issueUrl = `${base}/rest/api/2/issue/${encodeURIComponent(issueKey)}?fields=attachment`;
    const issue = await request(issueUrl, env.JIRA_PERSONAL_TOKEN, sslVerify, false);
    const attachments = issue?.fields?.attachment || [];

    const attachDir = path.join('.jira', issueKey, 'attachments');
    fs.mkdirSync(attachDir, { recursive: true });

    const saved = [];
    const failed = [];

    for (const att of attachments) {
      try {
        const buf = await request(att.content, env.JIRA_PERSONAL_TOKEN, sslVerify, true);
        const filepath = path.join(attachDir, att.filename);
        fs.writeFileSync(filepath, buf);
        saved.push(filepath);
      } catch (e) {
        failed.push({ filename: att.filename, error: e.message });
      }
    }

    console.log(JSON.stringify({ issue_key: issueKey, saved, failed }, null, 2));
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }));
    process.exit(1);
  }
})();
