This rule validates existing legacy `ffTest` calls. The runner is deprecated: prefer `passGate` and
`failGate` from `@atlassian/feature-flags-test-utils/mock-gates` when migrating or adding tests.
Preserve both enabled and disabled assertions and any supported combinations of nested gates.

```js
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

it('covers the enabled behavior', () => {
	passGate('my.feature.gate');
	// Render and assert the enabled behavior.
});

it('covers the disabled behavior', () => {
	failGate('my.feature.gate');
	// Render and assert the disabled behavior.
});
```

For an existing runner that cannot yet migrate, keep each flag name as a string literal and its
cases as inline arrow callbacks. Nested runners receive the outer callback's overrides parameter as
their fourth argument; the parameter and argument names must match. The autofix repairs missing or
mismatched override parameters. Keep the current setup and assertions; do not delete cases to
silence the rule or introduce the deprecated runner into new tests.

See the repository's
[feature-gate testing guidance](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/.agents/skills/feature-gates-experiments/SKILL.md#testing-feature-gates-and-experiments)
for gate and experiment helpers.

## Incorrect

```js
const flagName = 'my.feature.gate';

ffTest(flagName, () => {
	// Assert the enabled behavior.
}, () => {
	// Assert the disabled behavior.
});
```

## Correct

```js
ffTest('my.feature.gate', () => {
	// Assert the enabled behavior.
}, () => {
	// Assert the disabled behavior.
});
```
