# Use `fg` instead of `FeatureGates.checkGate` (feature-flags/use-recommended-utils)

`fg` method is recommended over `FeatureGates.checkGate`. The former is a wrapper to
`FeatureGates.checkGate` with unit testing mocking capabilities.

## Examples

### Feature Gates

👎 Examples of **incorrect** code for this rule: Gate is accessed with `FeatureGates.checkGate`

```tsx
import FeatureGates from '@atlaskit/feature-gate-js-client';

export const getThing = () => {
	if (FeatureGates.checkGate('my_gate')) {
		return getNewThing();
	}

	return getOldThing();
};
```

👍 Examples of **correct** code for this rule: Gate is accessed with `fg`

```tsx
import { fg } from '@atlassian/jira-feature-gating';

export const getThing = () => {
	if (fg('my_gate')) {
		return getNewThing();
	}

	return getOldThing();
};
```

### Experiments

👎 Examples of **incorrect** code for this rule: experiment is accessed with
`FeatureGates.getExperimentValue`

```tsx
import FeatureGates from '@atlaskit/feature-gate-js-client';

export const getThing = () => {
	if (FeatureGates.getExperimentValue('my_experiment', 'is_enabled', false)) {
		return newThing();
	}

	return oldThing();
};
```

👍 Examples of **correct** code for this rule: experiment is accessed with `expVal`

```tsx
import { expVal } from '@atlassian/jira-feature-experiments';

export const getThing = () => {
	if (expVal('my_experiment', 'is_enabled', false)) {
		return newThing();
	}

	return oldThing();
};
```
