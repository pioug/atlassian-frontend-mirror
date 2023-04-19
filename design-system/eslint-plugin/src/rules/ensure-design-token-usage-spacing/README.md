Using spacing,
typography,
and shape design tokens results in a harmonious experience for end users.

## Examples

Using anything other than design tokens such as hardcoded values or legacy theme colors will be considered violations.

### Incorrect

```js
css({  padding: 'red' });
                 ^^^
css({ margin: gridSize() });
              ^^^^^^^^^^
```

### Correct

```js
import { token } from '@atlaskit/tokens';

css({ padding: token('space.100') });
```

## Options

This rule comes with options to aid in migrating to design tokens.

### shouldEnforceFallbacks

When `true` the rule will add in stub fallbacks when choosing a suggestion in your IDE.
