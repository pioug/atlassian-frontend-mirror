# Enforce feature gate not used as a precondition in logical expressions (feature-flags/no-preconditioning)

Using a feature gate as a precondition in logical expressions can cause:

- Exposure to be tracked incorrectly
- Unnecessary code

## Examples

Instead of adding prerequisite gating in code, configure this in Statsig UI by adding rules to gates
and targeting for experiments. This will reduce unnecessary complexity in code and simplify cleanup.

```tsx
import { fg } from '@atlassian/jira-feature-gating';
import { expVal } from '@atlassian/jira-feature-experiments';

// Setup rule in `feature_milestone2` to fail if `feature_milestone1` fails
if (fg('feature_milestone1') && fg('feature_milestone2')) {
	doSomething();
}

// Setup targeting in `my_exp` to only enroll participants passing `my_gate`
if (fg('my_gate') && expVal('my_exp')) {
	doSomething();
}
```

Gating experiment values from same or different experiments is valid.

```tsx
import { expVal } from '@atlassian/jira-feature-experiments';

if (expVal('my_exp', 'delayRetries', false) && expVal('my_exp', 'numRetries', 0) > 3) {
	doSomething();
}
```

👎 Examples of **incorrect** exposure tracking

If `isAdmin` is false exposure will be fired even though feature was not intended for audience.

```tsx
import { fg } from '@atlassian/jira-feature-gating';

if (fg('my_gate') && isAdmin) {
	doSomething();
}
```

If `hasSelectedProject` is false and experiment returns true. Expsoure will be tracked as true even
though feature was not exposed to the user.

```tsx
import { fg } from '@atlassian/jira-feature-gating';

if (expVal('my_experiment', 'is_enabled', false) && hasSelectedProject) {
	doSomething();
}
```

👍 Examples of **correct** exposure tracking

```tsx
import { fg } from '@atlassian/jira-feature-gating';

if (isAdmin && fg('my_gate')) {
	doSomething();
}
```
