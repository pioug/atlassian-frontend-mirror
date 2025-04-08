# Temp Nav App Icons

A temporary package to house the app and brand icon tiles required for the System of Work / nav
experience refresh. This package is a stop gap until these use cases are properly incorporated into
the design system.

## Usage

```tsx
import { JiraLogo, JiraIcon } from '@atlaskit/temp-nav-app-icons/jira';

	// ...

	<JiraLogo label="Jira" />
	<JiraIcon label="Jira" size="24" />
```

## Icon props

### Appearance

`appearance` controls the color of a given app icon. By deafult, it is set to `brand`; the
`"legacy"` appearance change the tile background to the Atlassian blue.

### Size

Icon components support three sizes:

- `"12"`px, for use in bylines alongside small text
- `"16"`px, for use in smart links and other small UI elements
- `"20"`px, for use in side navigation app shortcuts
- `"24"`px, for use in the top navigation alongside the Logo components
- `"32"`px, for use in the App Switcher and Home

If other sizes are required, please wait for future updates to `@atlaskit/logo`, or reach out to
Design System Team.
