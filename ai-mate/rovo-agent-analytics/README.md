# RovoAgentAnalytics

Rovo Agents analytics

## Usage

`import RovoAgentAnalytics from '@atlaskit/rovo-agent-analytics';`

Detailed docs and example usage can be found
[here](https://atlaskit.atlassian.com/packages/ai-mate/rovo-agent-analytics).

## Examples

### Basic usage with common attributes

```typescript
import { useRovoAgentActionAnalytics, AgentCommonActions } from '@atlaskit/rovo-agent-analytics';

const { trackAgentAction } = useRovoAgentActionAnalytics({
	agentId,
	touchPoint: 'browse-agent-list',
});

// No additional attributes needed - agentId and touchPoint already provided
trackAgentAction(AgentCommonActions.DUPLICATE, {});
```

### Usage with debug actions (no attributes required)

```typescript
import { useRovoAgentActionAnalytics, AgentDebugActions } from '@atlaskit/rovo-agent-analytics';

const { trackAgentAction } = useRovoAgentActionAnalytics({});

// Debug actions don't require any attributes
trackAgentAction(AgentDebugActions.VIEW, {});
trackAgentAction(AgentDebugActions.COPY, {});
```

## Adding New Actions

### Step 1: Add the action to the appropriate enum

Add your new action to either `AgentCommonActions` or `AgentDebugActions` in
`src/actions/index.tsx`:

```typescript
export enum AgentCommonActions {
	// ... existing actions
	/* My new action - https://data-portal.internal.atlassian.com/analytics/registry/XXXXX */
	MY_NEW_ACTION = 'myNewAction',
}
```

### Step 2: Define attributes for the action

Add an entry to `ActionAttributes` to specify which attributes this action requires:

```typescript
type ActionAttributes = {
	// ... existing actions
	[AgentCommonActions.MY_NEW_ACTION]: CommonAnalyticsAttributes;
};
```

## Defining Custom Attributes Per Action

Each action can have its own specific attributes. The `trackAgentAction` function is generic and
will enforce the correct attributes based on the action you pass.

### Using CommonAnalyticsAttributes

For actions that only need `touchPoint` and `agentId`:

```typescript
type ActionAttributes = {
	[AgentCommonActions.VIEW]: CommonAnalyticsAttributes;
};
```

### Using Custom Attributes

For actions that need additional attributes beyond the common ones:

```typescript
type ActionAttributes = {
	[AgentCommonActions.STAR]: CommonAnalyticsAttributes & { isStarred: boolean };
};
```

When calling `trackAgentAction`, TypeScript will enforce the custom attributes:

```typescript
// TypeScript will require isStarred to be provided
trackAgentAction(AgentCommonActions.STAR, { isStarred: true });
```

### How Type Inference Works

The `trackAgentAction` function uses generics to infer required attributes:

1. When you call `trackAgentAction(action, attributes)`, TypeScript infers the action type
2. It looks up `ActionAttributes[action]` to get the required attributes for that action
3. It subtracts any attributes already provided in `commonAttributes` (via `RemainingRequired`)
4. The remaining attributes must be provided in the `attributes` parameter

Example:

```typescript
// If commonAttributes already includes agentId
const { trackAgentAction } = useRovoAgentActionAnalytics({ agentId: '123' });

// Only touchPoint is required since agentId was already provided
trackAgentAction(AgentCommonActions.VIEW, { touchPoint: 'my-touchpoint' });
```
