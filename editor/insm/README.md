# insm — Interactivity Session Measurement

A lightweight, session-based way to measure how interactive your experience feels to users. insm
summarizes interactivity quality for the time a user spends on a page or specific view, and emits a
single analytics event when the session ends.

## What insm measures

- Interactivity quality during periods of user activity within a session
- Both active time (when users are interacting) and overall session time
- Excludes explicitly-marked heavy/expected work so it doesn’t skew results
- A single, session-completion event with summary statistics and optional custom properties

## Common insm measurement tasks

### Instrumenting "heavy tasks"

Heavy tasks which are known to cause interactivity regressions can be explicitly opted out of the
interactivity measurement via explicitly marking the period of heavy work.

Use with care—prefer reducing the cost of heavy tasks over opting out of measurement. As a general
rule, only initialization and non-core actions should be marked heavy.

Examples of "heavy task" periods are

- page initialisation
  - when first loading a page — significant work will often be triggered to collect, arrange and
    present the page content to the user
- paste handling
  - for the edit-page paste handler — paste handling is currently known to be computationally
    expensive (and for large clipboard items, can lock up the UI for seconds). Given this is a non
    core experience — excluding this from interactivity monitoring ensures we have signal on the
    core experience.

```ts
insm.session.startHeavyTask('paste-handler');
// ... perform paste work ...
insm.session.endHeavyTask('paste-handler');
```

### Adding additional information to the session

Additional session information can be added through the `addProperties` api.

```ts
type ValidProperty = string | number | boolean;
insm.session.addProperties(
  propsOrFactory: Record<string, ValidProperty> | (() => Record<string, ValidProperty>)
): void
```

This api takes either a static single-level key-value object, or callbacks which return the same and
will be evaluated on session end.

When ending a session, all properties received via this api are merged, in order, into the resulting
insm event’s properties; last write wins.

Callback values are evaluated at session end.

For example, for the following

```ts
insm.session.addProperties({ one: 1, two: 2 });
insm.session.addProperties(() => ({ one: 'one' }));
insm.session.addProperties({ three: 3 });
```

The resulting added properties will be

```ts
{ one: 'one', two: 2, three: 3 }
```

### Getting current insm session details

```ts
insm.session.details;
```

This can be used to gate changes based on an individual experience.

ie.

```ts
if (insm.session.details.experienceKey === 'cc.edit-page' && gateCheck()) {
	insm.session.addProperties(() => ({
		/*potentially large or computationally large property bag */
	}));
}
```

### Flagging when a feature is being used

```ts
insm.session.startFeature(featureName: string): void
insm.session.endFeature(featureName: string): void
```

```ts
useEffect(() => {
	insm.session.startFeature('comment notification');
	return () => {
		insm.session.endFeature('comment notification');
	};
}, []);
```

In the resulting insm event;

- Long Animation frames will have any active features identified on them
- The slowest active sessions will have any features used during the active session identified on
  them

## How to instrument insm measurement

### Prerequisites

Your product must have the insm library installed — insm has the same prerequisites as UFO tooling
https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#prerequisites.

### Installation

```sh
yarn add @atlaskit/insm
```

### Initialisation

To begin instrumentation, initialise insm via invoking the init function and passing a config object
as defined by your instrumentation requirements.

```ts
import { init } from '@atlaskit/insm';

export function initialiseINSM(config) {
	/* logic to get/initialise your app's analytics client */
	init(config);
}
```

As early as possible in the application mount timeline (ideally, before the application is mounted),
initialise the insm client via the initialiseINSM function.

**Important**: insm will only track interactivity for explicitly allow-listed experiences — these
must be configured in the `config` passed.

```ts
{
	getAnalyticsWebClient,
	experiences: {
		['experience key']: {enabled: true}
	}
}
```

If an experience key is missing or not enabled, no session event will be emitted.

### Starting the page session

On route change/start call the insm start api.

```ts
insm.start(experienceKey, {
	contentId,
	initial,
});
```

Note: calling this will end any existing experience (unless the experience key and properties
match - in which case no session change will occur).

#### Naming guidance

Choose an `experienceKey` that reflects the product and content type you want to analyze.

Examples: `cc.view-page`, `cc.edit-page`, `cc.live-doc`

### Stop interactivity tracking for the page session

Ending a page session interactivity tracking is done by either;

- starting a new session.
- or when a tab session ends (ie. closing tab, refreshing page)

In some scenarios (ie. when a page error boundary is hit), you will want to exit early. This is
achieved by calling the following.

```ts
insm.stopEarly(reasonKey: string, description: string);
```

Sessions closed early are identifiable by their end details
`"endDetails": { stoppedBy: "early-stop", reasonKey, description }`.

**Note**: The session is ended as soon as stopEarly is called, any `addProperties` handlers will
called at this point.

### Tracking gate access

Call gateAccess whenever a gate is evaluated or changes during the session.

```ts
insm.gateAccess('gate key', 'gate rule');
```

This should be wired up to any gate access libraries/tools used by your product.
