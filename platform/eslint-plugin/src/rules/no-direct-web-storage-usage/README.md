# `@atlaskit/platform/no-direct-web-storage-usage`

Disallow direct usage of `window.localStorage` and `window.sessionStorage`.

This rule supports the
[CSM EG `CM-04` compliance work](https://hello.atlassian.net/wiki/spaces/H3/pages/6491936941),
which requires that CSM-owned code does not write user data to browser web
storage outside a vetted provider. Use one of the approved providers from
[`@atlassian/browser-storage-controls`](https://www.npmjs.com/package/@atlassian/browser-storage-controls)
(`AtlBrowserStorageLocal`, `AtlBrowserStorageSession`) instead.

## How the rule decides whether to fire

The rule fires on every linted source file, regardless of the owning team. Only
test and example files are skipped. Scope the rule to specific packages or
products through your ESLint config (for example an `overrides` block or a
product-specific preset) rather than through the rule itself.

## Examples

### ❌ Incorrect

```ts
window.localStorage.setItem('csm-key', 'value');
sessionStorage.getItem('csm-key');
const { localStorage } = window;
localStorage.removeItem('csm-key');
const n = window.localStorage.length;
```

### ✅ Correct

```ts
import { AtlBrowserStorageLocal } from '@atlassian/browser-storage-controls';

AtlBrowserStorageLocal.setItem('csm-key', 'value');
AtlBrowserStorageLocal.getItem('csm-key');
```

## Options

This rule has no configuration options.

```jsonc
{
	"rules": {
		"@atlaskit/platform/no-direct-web-storage-usage": "error"
	}
}
```

## When **not** to use

- For test / example / Storybook files, the rule self-skips.
- To limit the rule to specific packages or products, scope it via your ESLint
  config (e.g. an `overrides` block) rather than the rule itself.

## Related

- Reference implementation in Jira:
  `jira/dev-tooling/packages/eslint-plugin-jira/rules/web-storage/no-direct-web-storage-usage`
- BEARS-1330 — Add the platform variant of the rule for CSM packages.
- BEARS-1322 — Parent epic: CSM EG `CM-04` capability — `localStorage` compliance.
