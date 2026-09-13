## Home for codemods

As part of lite mode conversion for components in atlaskit, we found `codemods` with [jscodeshift](https://github.com/facebook/jscodeshift) are extremely helpful for migrating some breaking changes for our consumers. However, one pain point for us who need to write and maintain them is that we have to copy-paste the code snippet in many places.

So the purpose of this package is to relief that pain and centric all reusable `codemods` snippets into a single place, and all the further changes should happen in this repo only.

The goal is to release this repo as a npm package, so our users can simply introduce those generic functions and compose in their codebase.

### Examples

For example, when you want to depracate a prop called `isLoading` from your consumer's codebase, you can introduce some helper function into a file `transformer.ts` from `@atlaskit/codemod-utils`:

```js
import {
  createRemoveFuncFor,
  createTransformer,
} from '@atlaskit/codemod-utils';

const removeIsLoading = createRemoveFuncFor(
  '@atlaskit/fancycomponent',
  'ComponentName',
  'isLoading',
);

const transformer = createTransformer([removeIsLoading]);

export default transformer;
```

And then run the `transformer` like:

```sh
npx jscodeshift -t transformer.ts  --ignore-pattern node_modules --parser babel --extensions ts path/to/your/codebase
```

### Advanced usage

If you need more than one mutation against your codebase and want to apply all of them in one go, it's recommended to structure them properly into a separate folder.

For example, if you need 3 separate steps:

- remove `isLoading` prop
- rename `isDefaultChecked` to `defaultChecked`
- add a new prop `title`

then you can have a folder called `migrates` that contains:

- remove-isLoading.ts
- rename-isDefaultChecked-to-defaultChecked.ts
- add-title.ts

and for each file, you can have some code like:

```js
import { createAddingPropFor } from '@atlaskit/codemod-utils';

export const addTitle = createAddingPropFor('@atlaskit/fancycomponent', {
  prop: 'title',
  defaultValue: '',
});
```

and in your entrypoint for `jscodeshift` to pick up, you can introduce all those migrates:

```js
import { addTitle } from './migrates/add-title';
import { removeIsLoading } from './migrates/remove-isLoading';
import { renameDefaultChecked } from './migrates/rename-isDefaultChecked-to-defaultChecked.ts';

import { createTransformer } from './utils';

const transformer = createTransformer([
  renameDefaultChecked,
  removeIsLoading,
  addTitle,
]);

export default transformer;
```

This way, you can easily test those migrates separately with all the possible scenario, and compose them freely as well to see if they can work together to make the whole transform.
