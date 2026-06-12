# @atlaskit/editor-code-format-provider

Provides a code formatting provider compatible with the editor code block plugin.

## Usage

```ts
import { createCodeBlockFormatProvider } from '@atlaskit/editor-code-format-provider';

const formatCodeProvider = createCodeBlockFormatProvider();
```

Pass the provider to the code block plugin config:

```ts
codeBlock: {
	formatCodeProvider,
}
```

## Supported languages

- `json`
- `javascript`
- `jsx`
- `sql`

JSON, JavaScript, and JSX are formatted with Prettier standalone using the Babel and ESTree
plugins. SQL is formatted with `sql-formatter`.

## Loading behavior

Formatter dependencies are loaded lazily. Calling `preload(language)` loads and caches the formatter
for that language so the later `formatCode` call can reuse it. Failed formatter loads reset the cache
so a later attempt can retry.

## Results

`formatCode` returns:

- `formatted` when the formatted content differs from the input
- `unchanged` when formatting succeeds but does not change the input
- `failed` with `formatter-load-failed` when the formatter dependency cannot be loaded
- `failed` with `formatter-execution-failed` when the language is unsupported or formatting throws
