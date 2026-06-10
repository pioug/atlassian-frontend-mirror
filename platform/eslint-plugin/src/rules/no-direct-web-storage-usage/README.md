# `@atlaskit/platform/no-direct-web-storage-usage`

Disallow direct usage of `window.localStorage` and `window.sessionStorage` in
packages owned by a **CSM (Customer Service Management)** team.

This rule supports the
[CSM EG `CM-04` compliance work](https://hello.atlassian.net/wiki/spaces/H3/pages/6491936941),
which requires that CSM-owned code does not write user data to browser web
storage outside a vetted provider. Use one of the approved providers from
[`@atlassian/browser-storage-controls`](https://www.npmjs.com/package/@atlassian/browser-storage-controls)
(`AtlBrowserStorageLocal`, `AtlBrowserStorageSession`) instead.

## How the rule decides whether to fire

For each file being linted, the rule looks up the nearest `package.json` and
checks its `atlassian.team` value. It fires only when the team matches one of:

| Default-scoped team | Where it owns packages                       |
| ------------------- | -------------------------------------------- |
| `Boysenberry`       | `platform/`, `jira/`, and `help-center/`     |
| `Dropbears`         | `jira/` and `help-center/`                   |
| `CSM AI`            | `platform/`                                  |
| `CSM AI Exp`        | `jira/` and `help-center/`                   |

Files in packages owned by any other team — and all test / example files — are
ignored.

The team list is the authoritative scope: when a new package is created with
one of these team values, the rule starts enforcing automatically. When a
package is handed over to a CSM team, bumping its `atlassian.team` value to one
of the strings above immediately enables enforcement, with no tooling change.

## Examples

### ❌ Incorrect

```ts
// In a package whose package.json declares "atlassian": { "team": "CSM AI" }
window.localStorage.setItem('csm-key', 'value');
sessionStorage.getItem('csm-key');
const { localStorage } = window;
localStorage.removeItem('csm-key');
const n = window.localStorage.length;
```

### ✅ Correct

```ts
// Same package
import { AtlBrowserStorageLocal } from '@atlassian/browser-storage-controls';

AtlBrowserStorageLocal.setItem('csm-key', 'value');
AtlBrowserStorageLocal.getItem('csm-key');
```

```ts
// In a package whose package.json declares any other team — rule does not fire.
window.localStorage.setItem('not-a-csm-key', 'ok');
```

## Options

```jsonc
{
	"rules": {
		"@atlaskit/platform/no-direct-web-storage-usage": [
			"error",
			{
				// Optional. Appended to every reported violation message.
				"additionalInfo": "See go/csm-cm04 for guidance.",
				// Optional. Additional `atlassian.team` values to scope this rule
				// to. The provided values are **merged** with the four CSM
				// defaults (Boysenberry, Dropbears, CSM AI, CSM AI Exp) — passing
				// `additionalTeams` never disables enforcement for the defaults.
				"additionalTeams": ["Some New CSM Sub-team"]
			}
		]
	}
}
```

## When **not** to use

- For packages not owned by a CSM team, the rule self-skips — no action needed.
- For test / example / Storybook files, the rule self-skips.

## Related

- Reference implementation in Jira:
  `jira/dev-tooling/packages/eslint-plugin-jira/rules/web-storage/no-direct-web-storage-usage`
- BEARS-1330 — Add the platform variant of the rule for CSM packages.
- BEARS-1322 — Parent epic: CSM EG `CM-04` capability — `localStorage` compliance.
- `platform/.rovodev/notes/csm-team-names.md` — authoritative list of CSM team
  values to keep in sync with `DEFAULT_CSM_TEAMS` inside this rule.
