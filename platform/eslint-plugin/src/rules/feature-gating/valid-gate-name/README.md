# valid-gate-name

Ensures that feature gate names contain only valid characters.

## Rule Details

Feature gate names must only contain:

- **Lowercase letters** (`a-z`)
- **Numbers** (`0-9`)
- **Underscores** (`_`)
- **Hyphens** (`-`)
- **Dots** (`.`)

No spaces, capital letters, or other special characters are allowed.

### ❌ Invalid

```js
import { fg } from '@atlassian/jira-feature-gating';

fg('My.Feature.Gate'); // capital letters
fg('my feature gate'); // spaces
fg('MY_FEATURE_GATE'); // capital letters
```

### ✅ Valid

```js
import { fg } from '@atlassian/jira-feature-gating';

fg('my_feature_gate');
fg('my-feature-gate');
fg('my.feature.gate');
fg('feature123');
fg('gate_v2_enabled');
```

## No Autofix

This rule does **not** provide an autofix. Invalid gate names must be corrected manually to ensure the chosen name is intentional and correct.
