# no-internal-dependencies-in-public-packages

Blocks public packages (e.g. those under the `@atlaskit` scope) from declaring
install-affecting dependencies on internal-only packages (e.g. `@atlassian`, `@atlassiansox`,
`@af`).

## Why

Public `@atlaskit` packages are published to the public npm registry and installed by external
consumers. Internal packages are only available from Atlassian's internal registry. If a public
package ships with a dependency on an internal package, external installs break because npm cannot
resolve the internal dependency.

This rule is a fast pre-merge guardrail introduced after an incident where a public `@atlaskit`
package was published with an internal dependency, which broke installs for external consumers.

## What it checks

The public and internal scope prefixes are hardcoded in the rule:

- **Public** (published to public npm): `@atlaskit`
- **Internal** (Atlassian-only): `@atlassian`, `@atlassiansox`, `@af`

For any package whose `name` starts with a public prefix, the rule scans the following
**install-affecting** dependency fields and reports an error for every dependency whose name
matches an internal prefix:

- `dependencies`
- `peerDependencies`
- `optionalDependencies`

`devDependencies` are deliberately **not** scanned — they never reach a consumer's lockfile
(consistent with `ensure-no-private-dependencies`).

Packages marked `"private": true` are **skipped** — they are never published to the public npm
registry, so an internal dependency cannot break an external install.

Prefix matching is boundary-aware: `@af` matches `@af` and `@af/foo`, but not a differently-named
scope such as `@affoo`.

## Options

The public/internal prefixes are hardcoded; the only configurable option is `exceptions`.

```js
'@atlaskit/platform/no-internal-dependencies-in-public-packages': ['error', {
  exceptions: [],
}]
```

- **`exceptions`** (`string[]`, default `[]`) — package names that are exempt from the rule. Use
  this to land the rule green over pre-existing violations, then burn the list down.

## Adding an exception

Add the offending public package's exact `name` to the `exceptions` array where the rule is enabled
in `platform/eslint.config.cjs`. Prefer filing a follow-up ticket to remove the internal dependency
and then removing the exception, rather than leaving it in place.

## Examples

### Incorrect

```json
{
  "name": "@atlaskit/button",
  "dependencies": {
    "@atlassian/internal-thing": "^1.0.0"
  }
}
```

### Correct

```json
{
  "name": "@atlaskit/button",
  "dependencies": {
    "@atlaskit/theme": "^1.0.0",
    "react": "^18.0.0"
  }
}
```
