# no-barrel-entry-imports and no-barrel-entry-jest-mock

Two companion ESLint rules for eliminating barrel file imports from packages that use `package.json`
exports. These rules are designed to be run together.

## Overview

These rules target packages that define multiple export paths in their `package.json`. They
encourage importing from more specific subpaths instead of the main barrel entry point.

By default, the rules apply to packages within `platform/packages/ai-mate` and
`platform/packages/search`, but you can target **any directory** using the `applyToImportsFrom`
rule option (see [ESLint Configuration](#eslint-configuration)).

| Rule                        | What it fixes                                                             |
| --------------------------- | ------------------------------------------------------------------------- |
| `no-barrel-entry-imports`   | Import statements and simple jest automocks (`jest.mock('path')`)         |
| `no-barrel-entry-jest-mock` | Jest mock calls with factory functions (`jest.mock('path', () => {...})`) |

## ESLint Configuration

The rules use the plugin name `@atlaskit/platform`:

- `@atlaskit/platform/no-barrel-entry-imports`
- `@atlaskit/platform/no-barrel-entry-jest-mock`

To enable these rules for a specific package, add this snippet to `eslint.config.cjs`:

```javascript
	{
		name: 'Do not import or mock barrel files',
		files: ['packages/YOUR_DIRECTORY/YOUR_PACKAGE/**/*.{ts,tsx,js,jsx}'],
		rules: {
			'@atlaskit/platform/no-barrel-entry-imports': 'error',
			'@atlaskit/platform/no-barrel-entry-jest-mock': 'error',
		},
	},
```

### Targeting custom directories with `applyToImportsFrom`

By default, the rules check imports from packages in `platform/packages/ai-mate` and
`platform/packages/search`. To target packages in other directories, use the `applyToImportsFrom`
option with folder paths relative to the workspace root:

```javascript
	{
		name: 'Do not import or mock barrel files from my-product',
		files: ['packages/my-product/**/*.{ts,tsx,js,jsx}'],
		rules: {
			'@atlaskit/platform/no-barrel-entry-imports': [
				'error',
				{ applyToImportsFrom: ['platform/packages/my-product'] },
			],
			'@atlaskit/platform/no-barrel-entry-jest-mock': [
				'error',
				{ applyToImportsFrom: ['platform/packages/my-product'] },
			],
		},
	},
```

## Running Autofix

### Recommended: `barrel-removal-autofix` CLI

The easiest way to run these autofixes is via the
[`@atlassian/barrel-removal-autofix`](../../../../../../monorepo-tooling/barrel-removal-autofix/README.md)
CLI tool. It orchestrates both ESLint rules together and also handles dependency updates, lockfile
regeneration, tsconfig generation, and changeset creation automatically.

Run from the `platform/` directory:

```bash
# Fix cross-package barrel imports for a set of provider packages
afm workspace @atlassian/barrel-removal-autofix start \
  --providers-target ./packages/YOUR_DIRECTORY \
  --consumers-target ./packages \
  --cross-package-imports

# Dry-run to preview changes without modifying files
afm workspace @atlassian/barrel-removal-autofix start \
  --providers-target ./packages/YOUR_DIRECTORY \
  --consumers-target ./packages \
  --cross-package-imports \
  --dry-run
```

See the
[barrel-removal-autofix README](../../../../../../monorepo-tooling/barrel-removal-autofix/README.md)
for the full recommended workflow, including generating package exports and fixing relative imports.

### Alternative: Running ESLint directly

If you only need to run these two rules in isolation without the additional dependency/changeset
automation, you can invoke `yarn eslint` directly from the `platform/` directory:

```bash
yarn eslint \
  --rule '@atlaskit/platform/no-barrel-entry-imports: warn' \
  --rule '@atlaskit/platform/no-barrel-entry-jest-mock: warn' \
  --rule '@repo/internal/import/no-unresolved: off' \
  --no-warn-ignored --fix \
  'packages/YOUR_DIRECTORY/YOUR_PACKAGE/**/*.{ts,tsx,js,jsx}'
```

#### Example

```bash
# Fix barrel imports and jest mocks in conversation-assistant-service
yarn eslint \
  --rule '@atlaskit/platform/no-barrel-entry-imports: warn' \
  --rule '@atlaskit/platform/no-barrel-entry-jest-mock: warn' \
  --rule '@repo/internal/import/no-unresolved: off' \
  --no-warn-ignored --fix \
  'packages/ai-mate/conversation-assistant-service/**/*.{ts,tsx,js,jsx}'
```

#### Check without fixing

To see what would be fixed without making changes, omit `--fix`:

```bash
yarn eslint \
  --rule '@atlaskit/platform/no-barrel-entry-imports: warn' \
  --rule '@atlaskit/platform/no-barrel-entry-jest-mock: warn' \
  --rule '@repo/internal/import/no-unresolved: off' \
  --no-warn-ignored \
  'packages/YOUR_DIRECTORY/YOUR_PACKAGE/**/*.{ts,tsx,js,jsx}'
```

#### After running ESLint directly

When running ESLint directly (instead of the `barrel-removal-autofix` CLI), you will need to
manually handle the following:

1. Add any new packages to your `package.json` dependencies
2. Regenerate tsconfigs by running `afm ts generate`
3. Update the lockfile with `afm install --mode update-lockfile`
4. Create changesets for modified packages

## Why Use Both Rules?

The rules complement each other:

1. **`no-barrel-entry-imports`** handles import statements and updates any simple jest automocks
   (those without a factory function) when it rewrites imports.

2. **`no-barrel-entry-jest-mock`** handles jest.mock calls that have factory functions, which
   require more complex splitting logic to preserve mock implementations.

**Run `no-barrel-entry-imports` first**, then run `no-barrel-entry-jest-mock`. This order ensures
imports are fixed before the more complex jest mock transformations.

## Examples

### Before

```typescript
// Importing from main barrel entry
import { chatController, analyticsHelper } from '@atlassian/conversation-assistant-store';

// Simple automock (handled by no-barrel-entry-imports)
jest.mock('@atlassian/conversation-assistant-store');

// Mock with factory (handled by no-barrel-entry-jest-mock)
jest.mock('@atlassian/conversation-assistant-store', () => ({
	...jest.requireActual('@atlassian/conversation-assistant-store'),
	chatController: jest.fn(),
	analyticsHelper: jest.fn(),
}));
```

### After

```typescript
// Imports split by specific export paths
import { chatController } from '@atlassian/conversation-assistant-store/controllers/chat';
import { analyticsHelper } from '@atlassian/conversation-assistant-store/utils/analytics';

// Automocks split to match imports
jest.mock('@atlassian/conversation-assistant-store/controllers/chat');
jest.mock('@atlassian/conversation-assistant-store/utils/analytics');

// Mock with factory split into specific mocks
jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
	...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
	chatController: jest.fn(),
}));
jest.mock('@atlassian/conversation-assistant-store/utils/analytics', () => ({
	...jest.requireActual('@atlassian/conversation-assistant-store/utils/analytics'),
	analyticsHelper: jest.fn(),
}));
```

## Scope

By default, these rules apply to packages within `platform/packages/ai-mate` and
`platform/packages/search`. You can override this to target any directory by setting the
`applyToImportsFrom` option (see [ESLint Configuration](#eslint-configuration)).

Packages must have a `package.json` with an `exports` field defining subpath exports for the rules
to suggest alternatives.

## Special Cases

### Namespace imports

```typescript
import * as store from '@atlassian/conversation-assistant-store';
```

Namespace imports are flagged but **not auto-fixed** due to complexity.

### Cross-package re-exports

Both rules handle cross-package re-exports, where package A re-exports symbols from package B. The
fix will suggest importing directly from package B when appropriate.

### Type-only imports

Type-only imports (`import type { ... }`) are handled correctly and don't affect jest mock
transformations (since types don't exist at runtime).

## Related

- [`@atlassian/barrel-removal-autofix`](../../../../../../monorepo-tooling/barrel-removal-autofix/README.md) -
  CLI tool that orchestrates these rules with dependency updates and changeset generation
- [no-relative-barrel-file-imports](../no-relative-barrel-file-imports/README.md) - For relative
  barrel imports
- [no-jest-mock-barrel-files](../no-jest-mock-barrel-files/README.md) - For relative barrel jest
  mocks
