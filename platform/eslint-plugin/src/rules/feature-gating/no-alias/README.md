# Avoid aliasing feature flag utils (feature-flags/no-alias)

Ensure feature flag usage is statically analyzable. This applies to all methods, weather you are
writing production code, unit testing or storybooks.

## Examples

👎 Examples of **incorrect** code for this rule:

```tsx
// Do not alias utils
import { ff as getBoolean } from '@atlassian/jira-feature-flagging';

// Do not reassign utils
import { fg } from '@atlassian/jira-feature-gating';
const aliasedFG = fg;
```

👍 Examples of **correct** code for this rule: Do not alias utils

```tsx
import { ff } from '@atlassian/jira-feature-flagging';

export const doSomething = () => {
	if (ff('my.flag')) {
		console.log('hello');
	}
};
```
