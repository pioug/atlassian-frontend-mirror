# EditorProsemirror

Package to group all prosemirror libraries in a single place

## Usage

`import EditorProsemirror from '@atlaskit/editor-prosemirror';`

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/editor/editor-prosemirror).

## Codemods

There are some codemods to help the migration. But, they are supposed to run only once and manual in the AFE repo.

- optimistic-editor-prosemirror-usage

This one is reponsible to replace all prosemirror libraries usage with the new package e.g.:

```js
// before

import { DecorationSet } from 'prosemirror-view';

```

```js
// after

import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

```

## How to run

Run this script below

```js
npx @atlaskit/codemod-cli --parser tsx --extensions ts,tsx --transform packages/editor/editor-prosemirror/codemods/optimistic-next-editor-prosemirror-usage/ packages
```

## Troubleshooting

If you are getting this kind of error below:

```js
import { Binding, NodePath, Scope } from '@babel/traverse';
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at compileFunction (<anonymous>)
    at Object.compileFunction (node:vm:360:18)
```

Remove the token babel plugin from the `babel.config.shared.js` file.

## DO NOT COMMIT THIS CHANGE

```json
// file: babel.config.shared.js

    /** This override runs the tokens babel plugin on converted packages */
    {
      test: ['packages/'],
      // exclude plugin when building itself, or the tokens package it depends on
      exclude: [
        'packages/monorepo-tooling',
        'packages/design-system/tokens',
        'packages/design-system/eslint-plugin',
        'packages/design-system/storybook-addon',
        'packages/platform/feature-flags-codemods',
      ],
      plugins: [
        // Comment out this block
        //[
        //  './packages/design-system/tokens/babel-plugin',
        //  {
        //    shouldUseAutoFallback: true,
        //  },
        //],
      ],
    },
```
