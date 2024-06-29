# Inline feature flags/gates and experiments usages (feature-flags/inline-usage)

Ensure feature flags/gates and experiments are inlined so that they can be statically analyzable.

## Examples

👎 Examples of **incorrect** code for this rule: Feature flag call is assigned to a variable

```tsx
import { ff } from '@atlassian/jira-feature-flagging';

const myFF = () => ff('my_flag');

export const doSomething = () => {
	if (myFF()) {
		doSomethingNew();
	} else {
		doSomethingOld();
	}
};
```

👍 Examples of **correct** code for this rule: Usage is inlined

```tsx
import { ff } from '@atlassian/jira-feature-flagging';
import { fg } from '@atlassian/jira-feature-gating';
import { expValEquals } from '@atlassian/jira-feature-experiments';

export const doSomething = () => {
	if (ff('my_flag')) {
		doSomethingNew();
	} else {
		doSomethingOld();
	}
};

export const doSomething = () => {
	if (fg('my_gate')) {
		doSomethingNew();
	} else {
		doSomethingOld();
	}
};

export const doSomething = () => {
	if (expValEquals('my_exp', 'on', true)) {
		doSomethingNew();
	} else {
		doSomethingOld();
	}
};
```
