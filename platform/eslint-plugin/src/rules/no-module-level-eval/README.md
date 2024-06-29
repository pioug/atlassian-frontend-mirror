# Avoid using feature flags at module level (feature-flags/no-module-level-eval)

Disallow usage of feature flags in global/module scope. Due to JFE using SSR, feature flags should
not be called/initialised before components have mounted as it could cause errors.

## Examples

👎 Examples of **incorrect** code for this rule: ff is called in module scope

```tsx
import { ff } from '@atlassian/jira-feature-flagging';
import { OldComponent } from './old';
import { NewComponent } from './new';

const isEnabled = ff('is_enabled');

export const Component = ff('is_redesign') ? NewComponent : OldComponent;
```

👍 Examples of **correct** code to feature flag components: use ComponentWithFF

```tsx
import { ff } from '@atlassian/jira-feature-flagging';
import { ComponentWithFF } from '@atlassian/jira-feature-flagging-utils';

export const Container = () => {
	const isEnabled = ff('is_enabled');
};

export const Component = ComponentWithFF('is_redesign', NewComponent, OldComponent);
```

👍 Examples of **correct** code to feature flag functions: use functionWithCondition

```tsx
import { ff } from '@atlassian/jira-feature-flagging';
import { functionWithCondition } from '@atlassian/jira-feature-flagging-utils';

const selectorOld = createSelector(
	permissionsSelector,
	(permissions: Permissions): boolean => permissions.canCreateChildren,
);

// Change the signature of the selector by adding new arguments
const selectorNew = createSelector(
	permissionsSelector,
	supportedChildIssueTypesSelector,
	(permissions: Permissions, supportedChildIssueTypes: IssueTypeForHierarchyLevel[]): boolean =>
		permissions.canCreateChildren && !!supportedChildIssueTypes.length,
);

export const selector = functionWithCondition(() => ff('is_enabled'), selectorNew, selectorOld);
```
