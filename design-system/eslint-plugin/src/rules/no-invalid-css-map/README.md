Ensure that all usages of the `cssMap` API are valid, and enforces the format of the object that is
passed to `cssMap`.

Please refer to the [Compiled documentation](https://compiledcssinjs.com/docs/api-cssmap) for more
details and some examples.

Note that this version of the `no-invalid-css-map` rule differs from
`@compiled/eslint-plugin/no-invalid-css-map` in that this will apply to both `@compiled/react` and
`@atlaskit/css`.

This is intended to be used in conjunction with type checking (through TypeScript).

## Examples

### Incorrect

```tsx
import React from 'react';
import { cssMap } from '@compiled/react';

// cssMap needs to be declared in the top-most scope.
// (not within a function, class, etc.)

const Foo = () => {
	const bar = cssMap({
		danger: {
			color: 'red',
		},
	});
};
```

```tsx
import React from 'react';
import { cssMap } from '@compiled/react';
import { importedVariable, importedFunction } from 'another-package';

// Cannot use imported functions as values in cssMap.

const myVariable = importedFunction();

const styles = cssMap({
	danger: {
		// Both invalid because they rely on an imported function.
		color: myVariable,
		padding: importedFunction(),
	},
});
```

```tsx
import React from 'react';
import { cssMap } from '@compiled/react';

// Cannot export usages of cssMap.
// Any usages of cssMap must be in the same file.

export const foo = cssMap({
	danger: {
		color: 'red',
	},
});
```

```tsx
import React from 'react';
import { cssMap } from '@compiled/react';
import { token } from '@atlaskit/tokens';

// Functions and object methods are not allowed as
// values in cssMap.

const styles = cssMap({
	// Object method
	get danger() {
		return { color: '#123456' };
	},
});

const styles2 = cssMap({
	// Arrow function
	danger: () => {
		color: '#123456';
	},
});

function customFunction(...args) {
	return arguments.join('');
}

const styles3 = cssMap({
	danger: {
		// Locally defined function
		color: customFunction('red', 'blue'),
		backgroundColor: 'red',
	},
});
```

```tsx
import React from 'react';
import { cssMap } from '@compiled/react';

// Spread elements ("...") cannot be used in cssMap.

const base = {
	success: {
		color: 'green',
	},
};

const bar = cssMap({
	...base,
	danger: {
		color: 'red',
	},
});
```

### Correct

```tsx
import React from 'react';
import { cssMap } from '@compiled/react';

// Literals (strings, numbers, etc.) are used as values
// in cssMap.

const styles = cssMap({
	danger: {
		color: 'red',
		backgroundColor: 'red',
	},
	success: {
		color: 'green',
		backgroundColor: 'green',
	},
});
```

```tsx
import React from 'react';
import { cssMap } from '@compiled/react';

// A statically evaluable variable (known at build time)
// is used here.

const bap = 'blue';

const styles = cssMap({
	danger: {
		color: bap,
	},
});
```

### Options

#### `allowedFunctionCalls`: [string, string][]

Normally, this ESLint rule forbids all function calls from being used inside the `cssMap(...)`
function call. For example, this would be invalid using default settings:

```tsx
import React from 'react';
import { cssMap } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	danger: {
		color: token('my-color'),
		backgroundColor: 'red',
	},
	success: {
		color: 'green',
	},
});
```

If you would like to whitelist certain functions (e.g. `token` from `@atlaskit/tokens`), you can
include the names of the functions as part of the `allowedFunctionCalls` argument. Each function
should be represented as a two-element array, with the first element being the package the function
is from, and the second element being the name of the function.

For example, with the below configuration, the above code example would be okay.

```tsx
// eslint.config.cjs

// ...
      rules: {
        '@atlaskit/eslint-plugin-design-system/no-invalid-css-map': [
          'error',
          {
            allowedFunctionCalls: [
              ['@atlaskit/tokens', 'token'],
            ]
          },
        ],
        // ...
      },
// ...
```

Please note that this ESLint rule only supports whitelisting imports in the form
`import { myFunctionOrVariable } from 'my-package'`; we do not currently support whitelisting
default imports, so `import myFunctionOrVariable from 'my-package'` would always be invalid when
used in `cssMap`.
