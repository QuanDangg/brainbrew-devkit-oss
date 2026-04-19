---
name: ui-design
description: >-
  Review and create UI component specifications, check accessibility, and apply design patterns.
  Triggers on "design this component", "review the UI", "check accessibility", "improve the UX",
  "create a component spec". NOT for writing copy — use copywriting.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

## When to Use

- Designing a new UI component or page layout
- Reviewing existing UI for usability and accessibility issues
- Creating component specifications for implementation
- Checking WCAG compliance and accessibility
- Establishing design patterns or a component library

## When NOT to Use

- Writing button text or error messages — use `copywriting`
- Implementing the component code — use `implementation`
- Writing technical documentation — use `documentation`

## Instructions

### 1. Understand Requirements

Read the feature requirements or plan. Identify:
- Target users and their context (mobile, desktop, accessibility needs)
- Key user flows and interactions
- Existing design system or component library (check `docs/design-guidelines.md`, `src/components/`, or similar)

### 2. Review Existing Patterns

Use Glob and Grep to find existing UI components:
- Component file patterns: `**/*.component.tsx`, `**/components/**`
- Style files: `**/*.css`, `**/*.scss`, `**/*.styled.*`
- Design tokens: `**/theme.*`, `**/tokens.*`, `**/variables.*`

Note the existing patterns for spacing, colors, typography, and layout.

### 3. Create Component Specification

For each component, define:
- **Purpose:** What the component does
- **Props/Inputs:** Data it accepts
- **States:** Default, hover, active, disabled, loading, error, empty
- **Responsive behavior:** How it adapts to screen sizes
- **Interactions:** Click, hover, focus, keyboard navigation

### 4. Check Accessibility (WCAG 2.1 AA)

Verify or specify:
- Color contrast ratios (4.5:1 for text, 3:1 for large text)
- Keyboard navigation (all interactive elements reachable via Tab)
- Screen reader support (ARIA labels, roles, live regions)
- Focus indicators visible on all interactive elements
- Form inputs have associated labels
- Touch targets at least 44x44px on mobile

### 5. Document Design Decisions

## Output

```
## UI Design: [component/feature]

### Component Spec
- **Purpose:** [what it does]
- **Variants:** [list of variants]
- **States:** default | hover | active | disabled | loading | error

### Layout
[Description of layout, spacing, responsive breakpoints]

### Accessibility
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigable
- [ ] Screen reader labels present
- [ ] Focus indicators visible
- [ ] Touch targets adequate

### Design Decisions
[Rationale for key choices]

### Implementation Notes
[Guidance for the implementer]
```
