# no-relative-barrel-file-imports and no-jest-mock-barrel-files

Two companion ESLint rules for eliminating relative barrel file imports and jest mocks within
packages. These rules are designed to be run together.

## Overview

These rules detect when imports or jest mocks reference a relative barrel file (typically `index.ts`
or `index.tsx`). Barrel files re-export from other modules, and importing from them directly can
lead to performance issues and make dependencies less clear.

| Rule                              | What it fixes                                                            |
| --------------------------------- | ------------------------------------------------------------------------ |
| `no-relative-barrel-file-imports` | Import statements from relative barrel files                             |
| `no-jest-mock-barrel-files`       | Jest mock calls targeting relative barrel files (`jest.mock('./barrel')`) |

## ESLint Configuration

The rules use the plugin name `@atlaskit/platform`:

- `@atlaskit/platform/no-relative-barrel-file-imports`
- `@atlaskit/platform/no-jest-mock-barrel-files`

To enable these rules for a specific package, add this snippet to `eslint.config.cjs`:

```javascript
	{
		name: 'Do not import or mock relative barrel files',
		files: ['packages/YOUR_DIRECTORY/YOUR_PACKAGE/**/*.{ts,tsx,js,jsx}'],
		rules: {
			'@atlaskit/platform/no-relative-barrel-file-imports': 'error',
			'@atlaskit/platform/no-jest-mock-barrel-files': 'error',
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
# Fix relative barrel imports within packages
afm workspace @atlassian/barrel-removal-autofix start \
  --providers-target ./packages/YOUR_DIRECTORY \
  --consumers-target ./packages \
  --relative-imports

# Dry-run to preview changes without modifying files
afm workspace @atlassian/barrel-removal-autofix start \
  --providers-target ./packages/YOUR_DIRECTORY \
  --consumers-target ./packages \
  --relative-imports \
  --dry-run
```

See the
[barrel-removal-autofix README](../../../../../../monorepo-tooling/barrel-removal-autofix/README.md)
for the full recommended workflow.

### Alternative: Running ESLint directly

If you only need to run these two rules in isolation without the additional dependency/changeset
automation, you can invoke `yarn eslint` directly from the `platform/` directory:

```bash
yarn eslint \
  --rule '@atlaskit/platform/no-relative-barrel-file-imports: warn' \
  --rule '@atlaskit/platform/no-jest-mock-barrel-files: warn' \
  --no-warn-ignored --fix \
  'packages/YOUR_DIRECTORY/YOUR_PACKAGE/**/*.{ts,tsx,js,jsx}'
```

#### Check without fixing

To see what would be fixed without making changes, omit `--fix`:

```bash
yarn eslint \
  --rule '@atlaskit/platform/no-relative-barrel-file-imports: warn' \
  --rule '@atlaskit/platform/no-jest-mock-barrel-files: warn' \
  --no-warn-ignored \
  'packages/YOUR_DIRECTORY/YOUR_PACKAGE/**/*.{ts,tsx,js,jsx}'
```

## Why Use Both Rules?

The rules complement each other:

1. **`no-relative-barrel-file-imports`** handles import statements, splitting them into direct
   imports from the source files.

2. **`no-jest-mock-barrel-files`** handles `jest.mock()` calls — both simple automocks and mocks
   with factory functions — splitting them by source file.

**Run `no-relative-barrel-file-imports` first**, then run `no-jest-mock-barrel-files`. This order
ensures imports are fixed before the more complex jest mock transformations.

## Examples

### Imports

#### Before

```typescript
// utils/index.ts is a barrel file that re-exports from helpers.ts and validators.ts
import { helperA, validateEmail } from '../utils';
```

#### After

Auto-fix splits imports by source file:

```typescript
import { helperA } from '../utils/helpers';
import { validateEmail } from '../utils/validators';
```

### Jest Mocks

#### Before

```typescript
// Simple automock of a barrel file (handled by no-jest-mock-barrel-files)
jest.mock('../utils');

// Mock with factory function (handled by no-jest-mock-barrel-files)
jest.mock('../utils', () => ({
	...jest.requireActual('../utils'),
	helperA: jest.fn(),
	validateEmail: jest.fn(),
}));
```

#### After

```typescript
// Automocks split to match source files
jest.mock('../utils/helpers');
jest.mock('../utils/validators');

// Mock with factory split into specific mocks
jest.mock('../utils/helpers', () => ({
	...jest.requireActual('../utils/helpers'),
	helperA: jest.fn(),
}));
jest.mock('../utils/validators', () => ({
	...jest.requireActual('../utils/validators'),
	validateEmail: jest.fn(),
}));
```

### Mixed Default and Named Imports

```typescript
// BEFORE
import MyComponent, { utilA, utilB } from '../mixed';

// AFTER (if MyComponent and utils come from different files)
import MyComponent from '../mixed/main';
import { utilA, utilB } from '../mixed/utils';
```

## Why This Matters

Barrel files inflate dependency graphs and cause:

- **Slower TypeScript language server** (intellisense, type checking)
- **Inefficient test selection** in CI/CD
- **Longer build times** (bundling and transpilation)
- **Poor tree-shaking** in bundlers

By importing from specific source files instead of barrel files, you:

1. Make dependencies explicit and traceable
2. Improve tooling performance
3. Follow the barrel file removal initiative across Platform packages

## Special Cases

### Import Namespace (`import * as`)

```typescript
// This warns but does NOT auto-fix (too complex to refactor automatically)
import * as utils from '../utils';
```

The rule warns on namespace imports because they import from a barrel, but doesn't provide an
auto-fix since the semantics are complex and require manual refactoring.

### Single Source Files

If all imports in a statement come from the same source file, the rule does not warn:

```typescript
// This does NOT warn (all come from same file)
import { helperA, helperB } from '../utils';
```

### Type-only imports

Type-only imports (`import type { ... }`) are handled correctly by the import rule. For the mock
rule, type-only exports are excluded from automock splitting since types don't exist at runtime.

## Related

- [`@atlassian/barrel-removal-autofix`](../../../../../../monorepo-tooling/barrel-removal-autofix/README.md) -
  CLI tool that orchestrates these rules with dependency updates and changeset generation
- [no-barrel-entry-imports](../no-barrel-entry-imports/README.md) - For cross-package barrel imports
  and jest mocks
- [no-jest-mock-barrel-files](../no-jest-mock-barrel-files/README.md) - Companion rule for relative
  barrel jest mocks (documented here)
- [Barrel Files Guide](/docs/llm/agent-instructions/common/barrel-files.md)
- [Barrel File Removal Initiative](https://hello.atlassian.net/wiki/spaces/cacu/pages/5982553652)
