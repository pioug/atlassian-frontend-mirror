# Teams App Internal Analytics

A comprehensive analytics package for the Teams app and People & Teams platform packages. This
package provides type-safe analytics event definitions, context providers, and testing utilities for
tracking user interactions and system behaviors.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Adding New Events](#adding-new-events)
- [Analytics Context](#analytics-context)
- [Testing Analytics](#testing-analytics)

## Overview

This package implements a structured analytics system that is:

- **Type-safe**: All events and attributes are strongly typed
- **Declarative**: Events are defined in YAML specification files
- **Hierarchical**: Supports nested analytics contexts for rich metadata
- **Testable**: Comprehensive testing utilities included
- **Channel-specific**: Events are fired to the dedicated `peopleTeams` analytics channel

## Architecture

```
analytics.spec.yaml          ← Event definitions (YAML)
        ↓
   Code Generation           ← Generates TypeScript types & hooks
        ↓
Generated Files:
├── analytics.types.ts       ← Type definitions for events
├── create-event-payload.ts  ← Event payload creation logic
└── use-analytics-events.ts  ← React hook for firing events
        ↓
	Consumers		     	 ← Use hook to fire analytics events
        ↓
Analytics Listeners          ← Events sent to 'peopleTeams' channel
```

## Adding New Events

1. **Define the event** in `analytics.spec.yaml`:

[Event definition file specification](https://hello.atlassian.net/wiki/spaces/SMRT/pages/742668844/RFC+-+Analytic+Definition+File#Event-definition----Context)

```yaml
- button clicked (addUserToTeam):
    type: ui
    description: description of when this event fires
    attributes:
      <<: *PackageMetaDataContext
      newAttribute:
        type: string
        description: description of the new attribute
```

2. **Regenerate types**:

```bash
yarn analytics:codegen
```

3. **Use the new event**:

```tsx
import React from 'react';
import { useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics';

function TeamMemberButton() {
	const { fireEvent } = useAnalyticsEvents();

	const handleClick = () => {
		fireEvent('ui.button.clicked.addUserToTeam', {
			testAttribute: 'memberInvite',
		});
	};

	return <button onClick={handleClick}>Invite Member</button>;
}
```

### Event Naming Convention

Events follow this naming pattern:

- **UI Events**: `ui.[actionSubject].[action].[actionSubjectId]`
- **Track Events**: `track.[actionSubject].[action].[actionSubjectId]`
- **Operational Events**: `operational.[actionSubject].[action].[actionSubjectId]`
- **Screen Events**: `screen.[screenName].viewed`

## Analytics Context

The `PeopleTeamsAnalyticsContext` provides hierarchical metadata that is automatically included in
all events fired by child components.

### Nested Contexts

```tsx
<PeopleTeamsAnalyticsContext
	data={{
		source: 'teamsApp',
		attributes: { consumer: 'web' },
	}}
>
	<PeopleTeamsAnalyticsContext
		data={{
			source: 'teamsProfilePage',
			attributes: { teamId: 'team-123' },
		}}
	>
		<TeamProfile />
	</PeopleTeamsAnalyticsContext>
</PeopleTeamsAnalyticsContext>
```

**Resulting event payload:**

```json
{
	"eventType": "ui",
	"actionSubject": "button",
	"action": "clicked",
	"actionSubjectId": "analyticsExample",
	"source": "teamsProfilePage",
	"attributes": {
		"packageName": "@atlassian/team-profile",
		"packageVersion": "X.X.X",
		"consumer": "web",
		"teamId": "team-123",
		"testAttribute": "yourValue",
		"sourceHierarchy": "teamsApp.teamsProfilePage"
	}
}
```

### Context Priority

When contexts are nested, there is a priority system to ensure the correct metadata is appended to
events sent to GASv3. Duplicate data is resolved in the following order:

1. **Event data** (highest priority)
2. **Inner context data**
3. **Outer context data**

**Note**: Context `attributes` are only appended to events when they come from the `peopleTeamsCtx`
namespace, such as the `TeamsAppAnalyticsContext` from this package. Other event payload properties
like `source` will append to all events regardless of the context namespace.

## Testing Analytics

This package includes testing utilities that help you verify analytics events are sent correctly to
GASv3. These utilities use the processing logic from `PeopleTeamsAnalyticsListener`, ensuring that
event payloads (including all provided contexts) match the expected outcome.

### Basic Test Setup

```tsx
import {
	createMockAnalyticsClient,
	renderWithAnalyticsListener,
} from '@atlaskit/teams-app-internal-analytics/test-utils';

const mockClient = createMockAnalyticsClient();

test('should fire analytics event on button click', async () => {
	const { user, mockClient, expectEventToBeFired } = renderWithAnalyticsListener(
		<PeopleTeamsAnalyticsContext data={{ source: 'teamsApp' }}>
			<ButtonWithAnalytics testId="analytics-button" />
		</PeopleTeamsAnalyticsContext>,
		{ mockClient },
	);

	// Trigger the event
	await user.click(screen.getByTestId('analytics-button'));

	// Verify the event was fired correctly
	expectEventToBeFired('ui', {
		actionSubject: 'button',
		action: 'clicked',
		actionSubjectId: 'analyticsExample',
		source: 'teamsApp',
		attributes: expect.objectContaining({
			testAttribute: 'expectedValue',
		}),
	});
});
```
