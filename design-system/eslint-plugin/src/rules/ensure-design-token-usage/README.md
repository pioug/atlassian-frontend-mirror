Using color design tokens enables our experiences to be themed and harmonious.
All experiences must use these design tokens otherwise when switching between themes unexpected incidents can occur where not all of the UI is themed.

## Examples

Using anything other than design tokens such as hardcoded values or legacy theme colors will be considered violations.

### Incorrect

```js
import { e100 } from '@atlaskit/theme/elevation';
import { B100 } from '@atlaskit/theme/colors';

css({ color: 'red' });
              ^^^
css({ boxShadow: '0px 1px 1px #161A1D32' });
                          ^^^^^^^^^
css`${e100};`;
      ^^^^
css({ color: B100 });
             ^^^^
```

### Correct

```js
import { token } from '@atlaskit/tokens';

css({ boxShadow: token('elevation.shadow.card') });
```
