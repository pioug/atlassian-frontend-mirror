# @atlaskit/teams-app-internal-navigation

Headless navigation utilities and thin UI wrappers for the Teams app and People & Teams platform
packages. Ensures internal and external links behave consistently across the Teams app and embedded
People/Teams surfaces.

## Usage

### Basic Usage

Wrap your app with `TeamsNavigationProvider` and use the link components directly:

```tsx
import { TeamsNavigationProvider } from '@atlaskit/teams-app-internal-navigation/teams-navigation-provider';
import { TeamsAnchor } from '@atlaskit/teams-app-internal-navigation/teams-anchor';

function MyComponent() {
	return (
		<TeamsNavigationProvider value={{ navigate: pushRoute }}>
			<TeamsAnchor href="/teams/my-team" intent="navigation">
				My team
			</TeamsAnchor>
		</TeamsNavigationProvider>
	);
}
```

A complete example with `TeamsLink`, `TeamsLinkItem` and `TeamsLinkButton` is in
[`examples/basic.tsx`](./examples/basic.tsx).

### Headless API

Use `getNavigationProps` when you need to compose navigation behaviour onto custom markup or
non-ADS components:

```ts
import { getNavigationProps } from '@atlaskit/teams-app-internal-navigation/get-navigation-props';
```

It returns `href`, `target`, `rel` and a composed `onClick` from an `href`, intent,
`NavigationContext` and optional `onClick`.

## Features

### Navigation Intents

Each link declares an **intent** that controls how the browser or app handles the navigation:

- **`navigation`**: Moving within or between Atlassian apps
- **`reference`**: Documentation, support, or reference-style URLs
- **`action`**: Inline flows that may open a preview panel when the required props are set
- **`external`**: Third-party or explicitly external destinations
- **`unknown`**: Intent inferred automatically from the URL via `classifyNavigationIntent`

Automatic classification considers relative vs absolute URLs, non-HTTP schemes (`mailto:`, `tel:`,
etc.) and Atlassian-managed hosts (including FedRAMP and isolated cloud handling).

### Navigation Context

`TeamsAnchor`, `TeamsLink`, `TeamsLinkButton` and `TeamsLinkItem` all read from
`NavigationContext` via React context. The provider accepts:

- **`navigate(url)`**: When set, used for SPA-style navigation. When omitted, the browser handles
  navigation (e.g. full page load).
- **`openPreviewPanel(props)`**: Optional callback. For `action` intent, left-click can open a
  preview panel instead of navigating.
- **`forceExternalIntent`**: When `true`, links behave as external opens (e.g. new tab) even if
  the URL would otherwise be treated as in-app navigation — useful inside a preview panel.

## Package Exports

The main entry `@atlaskit/teams-app-internal-navigation` exports `TeamsAnchor`,
`TeamsNavigationProvider` and `useTeamsNavigationContext`.

| Subpath | Exports |
| --- | --- |
| `/teams-anchor` | `TeamsAnchor` (wraps ADS `Anchor`) |
| `/teams-link` | `TeamsLink` (wraps ADS `Link`) |
| `/teams-link-button` | `TeamsLinkButton` (wraps ADS `LinkButton`) |
| `/teams-link-item` | `TeamsLinkItem` (wraps ADS `LinkItem`) |
| `/teams-navigation-provider` | `TeamsNavigationProvider`, `useTeamsNavigationContext` |
| `/get-navigation-props` | `getNavigationProps`, `NavigationContext`, `NavigationIntent`, `NavigationIntentProps` |
