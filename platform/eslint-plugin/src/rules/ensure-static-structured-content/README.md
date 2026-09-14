# Require static structured content

Structured content is a machine-readable inventory of package APIs and design intent. Each
`*.docs.tsx` file must be a statically declared data file. The rule exits immediately for every
other filename.

## Incorrect

```tsx
const buildDoc = (name: string) => ({ name });

export default { components: [buildDoc('Button')] };
```

Functions, calls, conditionals, mutable bindings, dynamic imports, and arbitrary imports are
rejected. The only call exceptions are `path.resolve(...)` and `.join(...)` directly on a literal
array. The only module-data exception is importing or requiring a `package.json`. Type-only imports
and the `path` module are also allowed so docs can retain their type annotations and package-path
metadata.

## Correct

```tsx
import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';
import path from 'path';
import packageJson from './package.json';

const packagePath = path.resolve(__dirname);
const components = [
	{
		name: 'Button',
		import: { package: '@atlaskit/button', packagePath, packageJson },
	},
];

const documentation: StructuredContentSource = { components };
export default documentation;
```

Static const composition, object/array literals, `__dirname`, `path.resolve(...)`, literal-array
`.join(...)`, and direct imports or `require()` calls for package JSON are supported. Keep every
documented entry explicit so it remains easy to review and extract.
