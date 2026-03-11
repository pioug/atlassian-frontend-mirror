# RovoAgentAnalytics

Rovo Agents analytics library for composing and sending typed analytics events.

## Usage

```typescript
import { useRovoAgentActionAnalytics } from '@atlaskit/rovo-agent-analytics/actions';

const { trackAgentEvent } = useRovoAgentActionAnalytics({});

// Full control over event properties — all fields are type-checked
trackAgentEvent({
  action: 'view',
  actionSubject: 'rovoAgent',
  attributes: { 
    agentId: 'agent-123',
    touchPoint: 'browse-agent-list',
  },
});
```

Detailed docs and example usage can be found
[here](https://atlaskit.atlassian.com/packages/ai-mate/rovo-agent-analytics).

## Examples

### Basic Event Tracking

For fully-typed events with explicit `action`, `actionSubject`, and `attributes`:

```typescript
import { useRovoAgentActionAnalytics } from '@atlaskit/rovo-agent-analytics/actions';

const { trackAgentEvent } = useRovoAgentActionAnalytics({
  agentId,
  touchPoint: 'browse-agent-list',
});

// Track a user interaction
trackAgentEvent({
  action: 'duplicate',
  actionSubject: 'rovoAgent',
  attributes: {},
});
```

### Event Tracking with Custom Attributes

```typescript
import { useRovoAgentActionAnalytics } from '@atlaskit/rovo-agent-analytics/actions';

const { trackAgentEvent } = useRovoAgentActionAnalytics({});

// Full control over event properties — all fields are type-checked
trackAgentEvent({
  action: 'created',
  actionSubject: 'batchEvaluationDataset',
  attributes: { 
    totalQuestions: 5 
  },
  objectType: 'batchEvaluationDataset',
  objectId: 'dataset-123',
});
```

## Payload Types

Each group file in `src/actions/groups/` exports a **discriminated union payload type** that defines all valid event shapes for that group.

| File | Payload Type | Description |
| --- | --- | --- |
| `agent-interactions.ts` | `AgentInteractionsEventPayload` | User-initiated interactions (view, edit, delete, duplicate, star, chat, verify…) |
| `editing.ts` | `EditingEventPayload` | Agent save/mutation events (updated) |
| `debug.ts` | `DebugEventPayload` | Debug modal actions (view, copy, toggle skill info) |
| `tools.ts` | `ToolsEventPayload` | Tool execution actions (confirm, stream stop, result viewed, error) |
| `evaluation.ts` | `EvaluationEventPayload` | Batch evaluation events (dataset CRUD, job lifecycle, results viewed) |
| `create-flow.ts` | `CreateFlowEventPayload` | Create agent funnel steps |
| `add-tools-prompt.ts` | `AddToolsPromptEventPayload` | Add tools prompt modal events |

The combined `EventPayload` type (exported from `types.ts`) is a union of all these payload types.

## Adding a New Action

### To an existing payload type

1. Open the group file (e.g. `src/actions/groups/agent-interactions.ts`)
2. Add a new variant to the payload union type with a data-portal registry link:

```typescript
export type AgentInteractionsEventPayload =
  | {
      // https://data-portal.internal.atlassian.com/analytics/registry/XXXXX
      actionSubject: 'rovoAgent';
      action: 'myNewAction';
      attributes: BaseAgentAnalyticsAttributes & {
        myCustomField: string;
      };
    }
  | // ... existing variants
```

That's it — TypeScript will enforce the correct shape when calling `trackAgentEvent()`.

### To a new group

If your action doesn't fit any existing group, create a new one:

1. Create a new file in `src/actions/groups/` following the existing template
2. Export a discriminated union payload type (e.g. `MyFeatureEventPayload`)
3. Add the new type to the `EventPayload` union in `src/common/types.ts`:

```typescript
import type { MyFeatureEventPayload } from '../actions/groups/my-feature';

export type EventPayload =
  | EditingEventPayload
  | AgentInteractionsEventPayload
  // ... existing types
  | MyFeatureEventPayload;
```

## Defining Custom Attributes

Each action variant in a payload type can have its own specific attributes:

### Using BaseAgentAnalyticsAttributes

For actions that need `touchPoint` and `agentId`:

```typescript
{
  actionSubject: 'rovoAgent';
  action: 'view';
  attributes: BaseAgentAnalyticsAttributes;
}
```

### Using Custom Attributes

For actions that need additional attributes:

```typescript
{
  actionSubject: 'rovoAgent';
  action: 'updated';
  attributes: BaseAgentAnalyticsAttributes & { 
    agentType: string; 
    field: string; 
  };
}
```

## Entry Points

| Entry Point | Description |
| --- | --- |
| `@atlaskit/rovo-agent-analytics/actions` | Main entry point — exports `useRovoAgentActionAnalytics` hook |
| `@atlaskit/rovo-agent-analytics/create` | Create agent flow analytics — exports `useRovoAgentCreateAnalytics` hook and `AgentCreateAction` type |

### Create Flow Analytics

The `useRovoAgentCreateAnalytics` hook is used for tracking the agent creation funnel:

```typescript
import { useRovoAgentCreateAnalytics } from '@atlaskit/rovo-agent-analytics/create';

const [csid, { trackCreateSession, trackCreateSessionStart }] = useRovoAgentCreateAnalytics({
  touchPoint: 'agent-studio',
});

// Track funnel steps using string literal actions
trackCreateSession('createFlowStart');
trackCreateSession('createFlowActivate', { agentType: 'custom' });
```
