# @atlaskit/eslint-plugin-design-system/no-deprecated-api-usage

Ensures usage of up-to-date Atlassian Design System API usage.

## Examples

👎 Example of **incorrect** code for this rule:

```js
import { ButtonItem } from '@atlaskit/menu';

const Element = () => (
  <ButtonItem cssFn={cssFn()} />
              ^^^^
);                        
```

```js
import Drawer from '@atlaskit/drawer';

const Element = () => (
  <Drawer overrides={overrides} />
              ^^^^
);                        
```

👍 Example of **correct** code for this rule:

```js
import { SomeElement } from 'some-other-library';

const Element = () => (
  <SomeElement cssFn={cssFn()} />
);                        
```

```js
import { ButtonItem } from '@atlaskit/menu';

const Element = () => (
  <ButtonItem />
);                        
```

```js
import Drawer from '@atlaskit/drawer';

const Element = () => (
  <Drawer />
);  
```
