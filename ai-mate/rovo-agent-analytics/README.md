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

## Action Groups

Actions are organized into **groups** — self-contained files that define their actions, attribute
types, and a group name that gets automatically sent as `attributes.actionGroup` in every fired event.

All groups live in **one place**: `src/actions/groups/`.

| Group | File | Hook | Description |
| --- | --- | --- | --- |
| `agentInteractions` | `agent-interactions.ts` | actions | User-initiated interactions from overflow menu / profile (view, edit, delete, duplicate, star, chat, verify…) |
| `editing` | `editing.ts` | actions | Agent save/mutation events (updated) |
| `debug` | `debug.ts` | actions | Debug modal actions (view, copy, toggle skill info) |
| `tools` | `tools.ts` | actions | Tool execution actions (confirm, stream stop, result viewed, error) |
| `createFlow` | `create-flow.ts` | create | Create agent funnel steps (start, skip NL, review, activate, restart, error, land, discard) |
| `addToolsPrompt` | `add-tools-prompt.ts` | create | Add tools prompt modal shown when activating an agent with no tools (shown, browse, dismiss) |

The `actionGroup` value is visible in Databricks via `attributes.actionGroup`.

## Adding a New Action

### To an existing group

1. Open the group file (e.g. `src/actions/groups/agent-interactions.ts` or `src/actions/groups/create-flow.ts`)
2. Add the action to the enum with a data-portal registry link:

```typescript
export enum AgentInteractionActions {
	// ... existing actions
	/* My new action - https://data-portal.internal.atlassian.com/analytics/registry/XXXXX */
	MY_NEW_ACTION = 'myNewAction',
}
```

3. Add the attribute type in the same file:

```typescript
export type AgentInteractionAttributes = {
	// ... existing actions
	[AgentInteractionActions.MY_NEW_ACTION]: BaseAgentAnalyticsAttributes;
};
```

That's it — the action is automatically registered and will fire with `actionGroup: 'agentInteractions'`.

### To a new group

If your action doesn't fit any existing group, create a new one:

1. Create a new file in `src/actions/groups/`. Use any existing group file as a template — each one
   has a header comment explaining the structure.

2. Register the group in `src/actions/registry.ts`:

```typescript
// 1. Import the group
import {
	MyFeatureActions,
	type MyFeatureActionAttributes,
	ACTION_GROUP as MY_FEATURE_GROUP,
} from './groups/my-feature';

// 2. Add to the combined type
export type ActionAttributes = AgentInteractionAttributes &
	EditingActionAttributes &
	DebugActionAttributes &
	ToolsActionAttributes &
	MyFeatureActionAttributes;

// 3. Add to the runtime group map
export const ACTION_TO_GROUP: Record<string, string> = {
	...mapActionsToGroup(AgentInteractionActions, AGENT_INTERACTIONS_GROUP),
	...mapActionsToGroup(AgentEditingActions, EDITING_GROUP),
	...mapActionsToGroup(AgentDebugActions, DEBUG_GROUP),
	...mapActionsToGroup(AgentToolActions, TOOLS_GROUP),
	...mapActionsToGroup(MyFeatureActions, MY_FEATURE_GROUP),
};
```

## Defining Custom Attributes Per Action

Each action can have its own specific attributes. The `trackAgentAction` function is generic and
will enforce the correct attributes based on the action you pass.

### Using BaseAgentAnalyticsAttributes

For actions that only need `touchPoint` and `agentId`:

```typescript
export type AgentInteractionAttributes = {
	[AgentInteractionActions.VIEW]: BaseAgentAnalyticsAttributes;
};
```

### Using Custom Attributes

For actions that need additional attributes beyond the base ones:

```typescript
export type EditingActionAttributes = {
	[AgentEditingActions.UPDATED]: BaseAgentAnalyticsAttributes & { agentType: string; field: string };
};
```

When calling `trackAgentAction`, TypeScript will enforce the custom attributes:

```typescript
trackAgentAction(AgentEditingActions.UPDATED, { agentType: 'custom', field: 'name' });
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
