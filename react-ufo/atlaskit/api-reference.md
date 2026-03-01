---
title: React-UFO - Instrumentation API Reference
description: Complete API reference for @atlaskit/react-ufo performance instrumentation
platform: platform
product: ufo
category: devguide
subcategory: react-ufo
date: '2026-02-27'
---

# React UFO Instrumentation API Reference

React UFO is a performance monitoring library for React applications at Atlassian. It measures user
experience metrics including Time to App Idle (TTAI), Visual Completion (VC90/VC100), First
Meaningful Paint (FMP), and interaction responsiveness metrics like Input Delay (ID) and Input to
Next Paint (INP).

For a deep dive into how React UFO calculates these metrics, see
[An overview of how React UFO calculates frontend performance metrics](https://hello.atlassian.net/wiki/spaces/APD/pages/5046492124).

## Getting Started

```bash
yarn add @atlaskit/react-ufo
```

## Key Metrics

| Metric                                     | Description                                                                                                                                   |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **TTAI** (Time to App Idle)                | Time from interaction start until the next paint after all UFO holds become inactive and DOM mutations finish                                 |
| **VC90 / VC100** (Visual Completion)       | Time until 90% / 100% of visible viewport mutations are complete                                                                              |
| **FMP** (First Meaningful Paint)           | Time for primary page content to become visible. Derived from BM3 instrumentation, SSR timing, or defaults to TTAI                            |
| **TTI** (Time to Interactive)              | When the page is visible and ready for interaction. Calculated via BM3 manual instrumentation, earliest Apdex `stopTime`, or defaults to TTAI |
| **INP** (Input to Next Paint)              | Time for browser to render the next frame after receiving user input                                                                          |
| **ID** (Input Delay)                       | Time from the physical user action until first script execution                                                                               |
| **Response**                               | Time to next active React UFO hold rendered on the page. If no hold is active, equals Result (TTAI)                                           |
| **Result**                                 | Time to next render when no React UFO hold is active. Equivalent to TTAI                                                                      |
| **IVC100** (Interaction Visually Complete) | Time until last mutation visible in viewport for press interactions                                                                           |
| **TBT** (Total Blocking Time)              | Sum of blocking time from long tasks (>50ms) between FCP and TTI                                                                              |
| **CLS** (Cumulative Layout Shift)          | Largest burst of layout shift scores during the interaction window                                                                            |
| **LCP** (Largest Contentful Paint)         | Render time of the largest image or text block                                                                                                |

## API Reference

### Interaction Initializers

- [traceUFOPageLoad](#traceufopageload)
- [traceUFOPress](#traceufopress)
- [traceUFOTransition](#traceufotransition)
- [traceUFOInteraction](#traceufointeraction)
- [traceUFOHover](#traceufohover)
- [traceUFORedirect](#traceufodirect)

### React Components

- [UFOSegment](#ufosegment)
- [UFOThirdPartySegment](#ufothirdpartysegment)
- [UFOLabel](#ufolabel)
- [UFOLoadHold](#ufoloadhold)
- [UFOInteractionIgnore](#ufointeractionignore)
- [Suspense](#suspense)
- [UFOCustomData](#ufocustomdata)
- [UFOCustomCohortData](#ufocustomcohortdata)
- [UFOCustomMark](#ufocustommark)
- [Placeholder](#placeholder)

### React Hooks

- [usePressTracing](#usepresstracing)
- [useUFOTypingPerformanceTracing](#useufotypingperformancetracing)
- [useUFOTransitionCompleter](#useufotransitioncompleter)
- [useUFOReportError](#useuforeporterror)
- [useReportTerminalError](#usereportterminaerror)

### Utility Functions

- [addUFOCustomData](#addufocustomdata)
- [addUFOCustomCohortData](#addufocustomcohortdata)
- [addUFOCustomMark](#addufocustommark-1)
- [addCustomSpans](#addcustomspans)
- [addBM3TimingsToUFO](#addbm3timingstoufo)
- [addFeatureFlagAccessed](#addfeatureflagaccessed)
- [setInteractionError](#setinteractionerror)
- [setTerminalError](#setterminalerror)
- [sinkTerminalErrorHandler](#sinkterminalerrorhandler)
- [getUFORouteName](#getuforoutename)
- [updatePageloadName](#updatepageloadname)

### Component Integration

- [interactionName Property](#interactionname-property)

### Advanced APIs

- [SSR Configuration](#ssr-configuration)
- [Configuration](#configuration)
- [Experience Trace ID Context](#experience-trace-id-context)

---

## Interaction Initializers

### traceUFOPageLoad

Initializes measurement of page load performance for a specific route or page. Should be called
early in the page lifecycle to capture accurate timing data. Uses sampling rates configured in your
UFO settings.

Only one page load interaction can be active at a time. If called without a `ufoName` while no
interaction is active, it creates a new interaction with a hold until a name is provided. If called
with a `ufoName` while an unnamed page load interaction is active, it updates the name and releases
the hold.

**Import:**

```typescript
import traceUFOPageLoad from '@atlaskit/react-ufo/trace-pageload';
```

**Signature:**

```typescript
function traceUFOPageLoad(
	ufoName?: string | null | undefined,
	routeName?: string | null | undefined, // defaults to ufoName
): void;
```

**Parameters:**

- `ufoName` (string, optional): The UFO interaction name used for sampling and event identification
- `routeName` (string, optional): The route name for context. Defaults to `ufoName` if not provided

**Example:**

```typescript
import traceUFOPageLoad from '@atlaskit/react-ufo/trace-pageload';

// Simple usage
traceUFOPageLoad('issue-view');

// With separate route name
traceUFOPageLoad('issue-view', 'jira-issue-route');
```

**Also exports:**

```typescript
import { updatePageloadName } from '@atlaskit/react-ufo/trace-pageload';
```

See [updatePageloadName](#updatepageloadname) for details.

### traceUFOPress

Measures user interaction performance from a press/click event until all loading is complete. Use
this when `usePressTracing` hook or the `interactionName` property on components isn't suitable.

Only one interaction can be active at a time. Starting a new press interaction aborts any currently
active interaction. Aborted interactions do **not** report metrics to prevent data skewing.

**Import:**

```typescript
import traceUFOPress from '@atlaskit/react-ufo/trace-press';
```

**Signature:**

```typescript
function traceUFOPress(name: string, timestamp?: number): void;
```

**Parameters:**

- `name` (string): Unique identifier for the interaction
- `timestamp` (number, optional): Custom timestamp. Defaults to `performance.now()`

**Example:**

```typescript
import traceUFOPress from '@atlaskit/react-ufo/trace-press';

function CustomButton() {
  const handleClick = () => {
    traceUFOPress('custom-action');
    performAsyncAction();
  };

  return <button onClick={handleClick}>Custom Action</button>;
}
```

**When to use:**

- Custom components that don't support `interactionName`
- Complex interaction patterns
- Manual event handling scenarios

**Note:** Results are sent as `inline-result` type events. Prefer `usePressTracing` or
`interactionName` when possible.

### traceUFOTransition

Measures navigation transition performance between routes or major state changes within a
single-page application. Aborts all active interactions and starts measuring the new transition.

**Import:**

```typescript
import traceUFOTransition from '@atlaskit/react-ufo/trace-transition';
```

**Signature:**

```typescript
function traceUFOTransition(
	ufoName: string | null | undefined,
	routeName?: string | null | undefined, // defaults to ufoName
): void;
```

**Parameters:**

- `ufoName` (string): The UFO name for the transition
- `routeName` (string, optional): The route name for context. Defaults to `ufoName`

**Example:**

```typescript
import { useRouter } from '@atlassian/react-resource-router';
import traceUFOTransition from '@atlaskit/react-ufo/trace-transition';
import getUFORouteName from '@atlaskit/react-ufo/route-name';

function NavigationHandler() {
  const [routerState] = useRouter();

  useEffect(() => {
    const routeName = getUFORouteName(routerState.route);
    if (routeName) {
      traceUFOTransition(routeName);
    }
  }, [routerState]);

  return <div>Page content...</div>;
}
```

### traceUFOInteraction

Measures performance of user interactions based on browser events. Automatically detects the
interaction type (press or hover) from the event and applies appropriate timing.

**Import:**

```typescript
import traceUFOInteraction from '@atlaskit/react-ufo/trace-interaction';
```

**Signature:**

```typescript
function traceUFOInteraction(name: string, event: Event | UIEvent): void;
```

**Parameters:**

- `name` (string): Unique identifier for the interaction
- `event` (Event | UIEvent): Browser event object (must be trusted)

**Supported Event Types:**

| Event Type   | Maps to Interaction Type |
| ------------ | ------------------------ |
| `click`      | `press`                  |
| `dblclick`   | `press`                  |
| `mousedown`  | `press`                  |
| `mouseenter` | `hover`                  |
| `mouseover`  | `hover`                  |

**Example:**

```typescript
import traceUFOInteraction from '@atlaskit/react-ufo/trace-interaction';

function InteractiveComponent() {
  const handleClick = (event: React.MouseEvent) => {
    traceUFOInteraction('component-action', event.nativeEvent);
    setShowModal(true);
  };

  return <div onClick={handleClick}>Click me</div>;
}
```

**Notes:**

- Only trusted events (user-initiated) are processed
- Unsupported event types are silently ignored
- Event timestamp is automatically extracted from the event object

### traceUFOHover

Measures performance of hover interactions. Use this for tracking hover-triggered loading states
such as popups, tooltips, or preview cards.

**Import:**

```typescript
import traceUFOHover from '@atlaskit/react-ufo/trace-hover';
```

**Signature:**

```typescript
function traceUFOHover(name: string, timestamp?: number): void;
```

**Parameters:**

- `name` (string): Unique identifier for the hover interaction
- `timestamp` (number, optional): Custom timestamp. Defaults to `performance.now()`

**Example:**

```typescript
import traceUFOHover from '@atlaskit/react-ufo/trace-hover';

function HoverCard() {
  const handleMouseEnter = () => {
    traceUFOHover('user-profile-hover');
    loadUserProfile();
  };

  return <div onMouseEnter={handleMouseEnter}>Hover for details</div>;
}
```

### traceUFORedirect

Tracks navigation redirects between routes, providing detailed route transition information. This is
typically used with routing libraries like `@atlassian/react-resource-router`.

**Import:**

```typescript
import traceUFORedirect from '@atlaskit/react-ufo/trace-redirect';
```

**Signature:**

```typescript
function traceUFORedirect(
	fromUfoName: string,
	nextUfoName: string,
	nextRouteName: string,
	time: number,
): void;
```

**Parameters:**

- `fromUfoName` (string): Current route UFO name
- `nextUfoName` (string): Target route UFO name from route config
- `nextRouteName` (string): Target route name from route definition
- `time` (number): High-precision timestamp from `performance.now()`

**Example:**

```typescript
import { matchRoute, useRouter } from '@atlassian/react-resource-router';
import traceUFORedirect from '@atlaskit/react-ufo/trace-redirect';
import getUFORouteName from '@atlaskit/react-ufo/route-name';

function NavigationTracker() {
	const [routerState] = useRouter();

	const handleNavigation = (nextLocation) => {
		const currentRouteName = getUFORouteName(routerState.route);
		const nextMatchObject = matchRoute(routes, nextLocation.pathname, nextLocation.search);
		const { route: nextRoute } = nextMatchObject;
		const nextRouteUfoName = getUFORouteName(nextRoute);

		traceUFORedirect(currentRouteName, nextRouteUfoName, nextRoute.name, performance.now());
	};

	return null;
}
```

---

## React Components

### UFOSegment

A React context provider that defines distinct, measurable sections of your application. Each
segment generates its own performance payload, allowing granular analysis of different page areas.

**Import:**

```typescript
import UFOSegment from '@atlaskit/react-ufo/segment';
```

**Props:**

| Prop       | Type                             | Required | Description                                         |
| ---------- | -------------------------------- | -------- | --------------------------------------------------- |
| `name`     | `string`                         | Yes      | Unique identifier for this page segment             |
| `children` | `ReactNode`                      | Yes      | Components to be measured within this segment       |
| `mode`     | `'list' \| 'single'`             | No       | Rendering mode for the segment                      |
| `type`     | `'first-party' \| 'third-party'` | No       | Segment ownership type. Defaults to `'first-party'` |

**Example:**

```typescript
import UFOSegment from '@atlaskit/react-ufo/segment';

function IssuePage() {
  return (
    <div>
      <UFOSegment name="issue-header">
        <IssueHeader />
      </UFOSegment>

      <UFOSegment name="issue-content">
        <IssueDescription />
        <IssueComments />
      </UFOSegment>

      <UFOSegment name="issue-sidebar">
        <IssueSidebar />
      </UFOSegment>
    </div>
  );
}
```

**Event Generation:** For a page load with UFO name `issue-view`, segments generate:

- Main interaction: `jira.fe.page-load.issue-view`
- Segment events:
  - `jira.fe.page-segment-load.issue-header`
  - `jira.fe.page-segment-load.issue-content`
  - `jira.fe.page-segment-load.issue-sidebar`

**Best Practices:**

- Use distinct, meaningful names for each segment
- Represent logical page sections that could theoretically render independently
- Avoid generic names like "content" or "main" — be specific
- Segments with identical names are aggregated in analytics
- Nesting is supported but use judiciously

### UFOThirdPartySegment

A specialized segment for tracking external or plugin content separately from first-party code.
Wraps `UFOSegment` with `type="third-party"`.

**Import:**

```typescript
import { UFOThirdPartySegment } from '@atlaskit/react-ufo/segment';
```

**Props:**

Same as `UFOSegment` except `type` is automatically set to `'third-party'`.

**Example:**

```typescript
import { UFOThirdPartySegment } from '@atlaskit/react-ufo/segment';

<UFOThirdPartySegment name="confluence-macro-calendar">
  <CalendarMacro />
</UFOThirdPartySegment>
```

**Use Cases:**

- External service integrations
- Third-party plugins or widgets
- Partner-provided components
- Any content not directly controlled by your team

### UFOLabel

A React context provider used to annotate sections of your component tree with descriptive names.
Unlike segments, labels don't generate separate events but provide context for debugging and
analysis in VC revision data.

**Import:**

```typescript
import UFOLabel from '@atlaskit/react-ufo/label';
```

**Props:**

| Prop       | Type        | Required | Description                            |
| ---------- | ----------- | -------- | -------------------------------------- |
| `name`     | `string`    | Yes      | Descriptive name for this section      |
| `children` | `ReactNode` | Yes      | Components within this labeled section |

**Example:**

```typescript
import UFOLabel from '@atlaskit/react-ufo/label';

function CommentThread() {
  return (
    <UFOLabel name="comment_thread">
      <div>
        <UFOLabel name="comment_author">
          <UserAvatar user={author} />
        </UFOLabel>
        <UFOLabel name="comment_content">
          <CommentBody content={comment.body} />
        </UFOLabel>
      </div>
    </UFOLabel>
  );
}
```

**Guidelines:**

- Use static strings only — no dynamic values
- Focus on being distinct rather than semantically perfect
- No need to label every component — use judiciously
- Helps with debugging performance issues in specific UI areas

### UFOLoadHold

Identifies loading elements and prevents interaction completion until they are no longer active.
This component is crucial for accurate TTAI measurements — an interaction's TTAI is determined by
the point at which the last hold is released.

**Import:**

```typescript
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
```

**Props:**

| Prop           | Type        | Required | Default     | Description                                                                     |
| -------------- | ----------- | -------- | ----------- | ------------------------------------------------------------------------------- |
| `name`         | `string`    | Yes      | —           | Unique identifier for this loading state                                        |
| `hold`         | `boolean`   | No       | `undefined` | Controls whether the hold is active. When omitted, hold is active while mounted |
| `children`     | `ReactNode` | No       | —           | Components wrapped by the hold                                                  |
| `experimental` | `boolean`   | No       | `undefined` | Enables experimental hold behavior                                              |

**Usage Patterns:**

**1. Wrapping loading elements (hold while mounted):**

```typescript
if (isLoading) {
  return (
    <UFOLoadHold name="card-loading">
      <Skeleton />
    </UFOLoadHold>
  );
}
```

**2. As a sibling component:**

```typescript
return (
  <>
    <Skeleton />
    <UFOLoadHold name="card-loading" />
  </>
);
```

**3. Conditional hold via prop:**

```typescript
<UFOLoadHold name="card" hold={isLoading}>
  <Card />
</UFOLoadHold>
```

**4. Conditional sibling:**

```typescript
return (
  <>
    <Card />
    <UFOLoadHold name="card" hold={isLoading} />
  </>
);
```

**Notes:**

- Only instrument loading elements once if they're reused
- Multiple holds with the same name are fine
- Holds automatically release when the component unmounts
- Holds that are added after the interaction is already complete (after TTAI) are called "late
  holds" and are tracked separately

### UFOInteractionIgnore

Prevents a subtree from holding up an interaction. Use this when a component loads late but isn't
considered a breach of your SLO.

**Import:**

```typescript
import UFOInteractionIgnore from '@atlaskit/react-ufo/interaction-ignore';
```

**Props:**

| Prop       | Type                    | Required | Default | Description                             |
| ---------- | ----------------------- | -------- | ------- | --------------------------------------- |
| `children` | `ReactNode`             | No       | —       | Components within the ignored subtree   |
| `ignore`   | `boolean`               | No       | `true`  | Whether to ignore holds in this subtree |
| `reason`   | `'third-party-element'` | No       | —       | Reason for ignoring holds               |

**Example:**

```typescript
import UFOInteractionIgnore from '@atlaskit/react-ufo/interaction-ignore';

function PageLayout() {
  return (
    <App>
      <Main />
      <Sidebar>
        <UFOInteractionIgnore>
          <InsightsButton />
        </UFOInteractionIgnore>
      </Sidebar>
    </App>
  );
}

// Conditional usage
<UFOInteractionIgnore ignore={!isCriticalContent}>
  <OptionalWidget />
</UFOInteractionIgnore>
```

### Suspense

An enhanced React Suspense boundary that integrates with UFO instrumentation. Wraps React's
`Suspense` component and adds a `UFOLoadHold` around the fallback, so the interaction is held until
the suspended component resolves.

**Import:**

```typescript
import Suspense from '@atlaskit/react-ufo/suspense';
```

**Props:**

| Prop              | Type        | Required | Description                                                          |
| ----------------- | ----------- | -------- | -------------------------------------------------------------------- |
| `interactionName` | `string`    | Yes      | Unique identifier for this suspense boundary (used as the hold name) |
| `fallback`        | `ReactNode` | Yes      | Component to show while suspended                                    |
| `children`        | `ReactNode` | Yes      | Components that might suspend                                        |

**Example:**

```typescript
import Suspense from '@atlaskit/react-ufo/suspense';

const LazyIssueView = lazy(() => import('./IssueView'));

function App() {
  return (
    <Suspense interactionName="issue-view-lazy" fallback={<IssueViewSkeleton />}>
      <LazyIssueView />
    </Suspense>
  );
}
```

### UFOCustomData

Adds custom metadata to the current UFO interaction. This data appears in analytics events with a
`custom:` prefix.

**Import:**

```typescript
import UFOCustomData from '@atlaskit/react-ufo/custom-data';
```

**Props:**

| Prop   | Type                      | Required | Description                    |
| ------ | ------------------------- | -------- | ------------------------------ |
| `data` | `Record<string, unknown>` | Yes      | Key-value pairs of custom data |

**Example:**

```typescript
import UFOCustomData from '@atlaskit/react-ufo/custom-data';

function IssueList({ issues, viewType }) {
  return (
    <div>
      <UFOCustomData data={{ viewType, issueCount: issues.length }} />
      <IssueTable issues={issues} />
    </div>
  );
}
```

**Output in analytics:**

```javascript
{
  'custom:viewType': 'list',
  'custom:issueCount': 42
}
```

### UFOCustomCohortData

Adds cohort-specific custom data to UFO interactions. Used for A/B testing and feature flag
correlation.

**Import:**

```typescript
import UFOCustomCohortData from '@atlaskit/react-ufo/custom-cohort-data';
```

**Props:**

| Prop      | Type                                               | Required | Description       |
| --------- | -------------------------------------------------- | -------- | ----------------- |
| `dataKey` | `string`                                           | Yes      | Cohort data key   |
| `value`   | `string \| number \| boolean \| null \| undefined` | Yes      | Cohort data value |

**Example:**

```typescript
import UFOCustomCohortData from '@atlaskit/react-ufo/custom-cohort-data';
import { fg } from '@atlaskit/platform-feature-flags';

function ExperimentalFeature() {
  const variant = fg('new_issue_view') ? 'treatment' : 'control';

  return (
    <div>
      <UFOCustomCohortData dataKey="new_issue_view_variant" value={variant} />
      {variant === 'treatment' ? <NewIssueView /> : <OldIssueView />}
    </div>
  );
}
```

### UFOCustomMark

Records a custom performance mark at a specific point in time during the current interaction.

**Import:**

```typescript
import UFOCustomMark from '@atlaskit/react-ufo/custom-mark';
```

**Props:**

| Prop        | Type     | Required | Description                                       |
| ----------- | -------- | -------- | ------------------------------------------------- |
| `name`      | `string` | Yes      | Name of the mark                                  |
| `timestamp` | `number` | No       | Custom timestamp. Defaults to `performance.now()` |

**Example:**

```typescript
import UFOCustomMark from '@atlaskit/react-ufo/custom-mark';

function DataTable({ data }) {
  return (
    <div>
      <UFOCustomMark name="data-table-render-start" />
      <Table data={data} />
    </div>
  );
}
```

**Also available:** `UFOCustomMarks` component for setting multiple marks at once:

```typescript
import { UFOCustomMarks } from '@atlaskit/react-ufo/custom-mark';

<UFOCustomMarks data={{ 'mark-a': timestamp1, 'mark-b': timestamp2 }} />
```

### Placeholder

A UFO-instrumented wrapper around lazy-loaded components using Suspense. Provides hold tracking for
lazy-loaded content.

**Import:**

```typescript
import Placeholder from '@atlaskit/react-ufo/placeholder';
```

**Props:**

| Prop       | Type        | Required | Description                            |
| ---------- | ----------- | -------- | -------------------------------------- |
| `name`     | `string`    | Yes      | Unique identifier for this placeholder |
| `children` | `ReactNode` | No       | Lazy-loaded components                 |
| `fallback` | `ReactNode` | No       | Component to show while loading        |

**Example:**

```typescript
import Placeholder from '@atlaskit/react-ufo/placeholder';

const LazyPanel = lazy(() => import('./Panel'));

function App() {
  return (
    <Placeholder name="panel-placeholder" fallback={<PanelSkeleton />}>
      <LazyPanel />
    </Placeholder>
  );
}
```

---

## React Hooks

### usePressTracing

A hook that provides a function to trace user press interactions. Use this for custom components
that need interaction tracking.

**Import:**

```typescript
import usePressTracing from '@atlaskit/react-ufo/use-press-tracing';
```

**Signature:**

```typescript
function usePressTracing(name: string): (timeStamp?: number) => void;
```

**Parameters:**

- `name` (string): The UFO interaction name

**Returns:**

- A function to call when the interaction starts. Accepts an optional `timeStamp` parameter.

**Example:**

```typescript
import { useCallback } from 'react';
import usePressTracing from '@atlaskit/react-ufo/use-press-tracing';

function CustomButton({ onAction }) {
  const traceInteraction = usePressTracing('custom-action');

  const handleClick = useCallback(
    (event) => {
      traceInteraction(event.timeStamp);
      onAction();
    },
    [traceInteraction, onAction],
  );

  return <button onClick={handleClick}>Custom Action</button>;
}
```

**Note:** Results are sent as `inline-result` type events.

### useUFOTypingPerformanceTracing

Measures typing latency in input fields to track user experience during text input.

**Import:**

```typescript
import useUFOTypingPerformanceTracing from '@atlaskit/react-ufo/typing-performance-tracing';
```

**Signature:**

```typescript
function useUFOTypingPerformanceTracing<T extends HTMLElement>(name: string): React.RefObject<T>;
```

**Parameters:**

- `name` (string): Identifier for the typing performance trace

**Returns:**

- A React ref to attach to the input element

**Example:**

```typescript
import useUFOTypingPerformanceTracing from '@atlaskit/react-ufo/typing-performance-tracing';

function CommentEditor() {
  const typingRef = useUFOTypingPerformanceTracing<HTMLTextAreaElement>('comment-editor-typing');

  return <textarea ref={typingRef} placeholder="Write a comment..." />;
}
```

**Metrics Captured:**

- Minimum typing latency
- Maximum typing latency
- Average typing latency
- Key press count
- Count of key presses under 50ms

**Notes:**

- Starts measuring on first keypress
- Sends metrics after 2 seconds of inactivity
- Only character-producing keys are measured (not backspace, etc.)

### useUFOTransitionCompleter

Automatically completes UFO transitions when the component mounts. Use this in destination route
components to signal that the transition is complete.

**Import:**

```typescript
import { useUFOTransitionCompleter } from '@atlaskit/react-ufo/trace-transition';
```

**Example:**

```typescript
import { useUFOTransitionCompleter } from '@atlaskit/react-ufo/trace-transition';

function IssueViewPage() {
  useUFOTransitionCompleter();

  return (
    <div>
      <IssueHeader />
      <IssueContent />
    </div>
  );
}
```

### useUFOReportError

A hook that provides a function to report errors within UFO interactions. Errors are automatically
associated with the currently active UFO interaction.

**Import:**

```typescript
import { useUFOReportError } from '@atlaskit/react-ufo/report-error';
```

**Returns:**

- A function that accepts an error object with:
  - `name` (string): Error name/type
  - `errorMessage` (string): Error description
  - `errorStack` (string, optional): Error stack trace
  - `forcedError` (boolean, optional): Whether this was intentionally triggered
  - `errorHash` (string, optional): Custom error identifier
  - `errorStatusCode` (number, optional): HTTP status code if applicable

**Example:**

```typescript
import { useUFOReportError } from '@atlaskit/react-ufo/report-error';

function DataLoader({ issueId }) {
	const reportError = useUFOReportError();

	const loadIssueData = async () => {
		try {
			const issue = await fetchIssue(issueId);
			return issue;
		} catch (error) {
			reportError({
				name: 'IssueLoadError',
				errorMessage: error.message,
				errorStack: error.stack,
				errorStatusCode: error.status,
			});
			throw error;
		}
	};

	// Component logic...
}
```

### useReportTerminalError

A hook that reports a terminal error to UFO when the error is first set. Terminal errors represent
critical failures that prevent the user from completing their task — typically rendered via error
boundaries.

**Import:**

```typescript
import { useReportTerminalError } from '@atlaskit/react-ufo/set-terminal-error';
```

**Signature:**

```typescript
function useReportTerminalError(
	error: Error | null | undefined,
	additionalAttributes?: TerminalErrorAdditionalAttributes,
): void;
```

**Parameters:**

- `error` (Error | null | undefined): The error to report. Only reported once when first set.
- `additionalAttributes` (optional): See [setTerminalError](#setterminalerror) for details.

**Example:**

```typescript
import { useReportTerminalError } from '@atlaskit/react-ufo/set-terminal-error';

function ErrorBoundaryFallback({ error }) {
  useReportTerminalError(error, {
    errorBoundaryId: 'issue-view',
    fallbackType: 'page',
    teamName: 'my-team',
  });

  return <ErrorPage />;
}
```

---

## Utility Functions

### addUFOCustomData

Programmatically adds custom data to the current UFO interaction without using a component.

**Import:**

```typescript
import { addUFOCustomData } from '@atlaskit/react-ufo/custom-data';
```

**Signature:**

```typescript
function addUFOCustomData(data: Record<string, unknown>): void;
```

**Example:**

```typescript
import { addUFOCustomData } from '@atlaskit/react-ufo/custom-data';

function performSearch(query) {
	addUFOCustomData({
		searchQuery: query,
		searchType: 'advanced',
		hasFilters: filters.length > 0,
	});

	return searchAPI(query);
}
```

### addUFOCustomCohortData

Programmatically adds cohort data for A/B testing and feature flag tracking.

**Import:**

```typescript
import { addUFOCustomCohortData } from '@atlaskit/react-ufo/custom-cohort-data';
```

**Signature:**

```typescript
function addUFOCustomCohortData(
	key: string,
	value: number | boolean | string | null | undefined,
): void;
```

**Example:**

```typescript
import { addUFOCustomCohortData } from '@atlaskit/react-ufo/custom-cohort-data';
import { fg } from '@atlaskit/platform-feature-flags';

function initializeExperiment() {
	const isNewDesignEnabled = fg('new_design_system');

	addUFOCustomCohortData('design_system_version', isNewDesignEnabled ? 'v2' : 'v1');
	addUFOCustomCohortData('user_segment', getUserSegment());
}
```

### addUFOCustomMark

Programmatically records a custom performance mark at a specific point in time.

**Import:**

```typescript
import { addUFOCustomMark } from '@atlaskit/react-ufo/custom-mark';
```

**Signature:**

```typescript
function addUFOCustomMark(name: string, timestamp?: number): void;
```

**Parameters:**

- `name` (string): Name of the mark
- `timestamp` (number, optional): Custom timestamp. Defaults to `performance.now()`

**Example:**

```typescript
import { addUFOCustomMark } from '@atlaskit/react-ufo/custom-mark';

function onDataFetched() {
	addUFOCustomMark('data-fetch-complete');
}
```

### addCustomSpans

Records a custom performance span (a time range with a start and end) to all active interactions.

**Import:**

```typescript
import { addCustomSpans } from '@atlaskit/react-ufo/custom-spans';
```

**Signature:**

```typescript
function addCustomSpans(
	name: string,
	start: number,
	end?: number, // defaults to performance.now()
	size?: number, // defaults to 0
): void;
```

**Example:**

```typescript
import { addCustomSpans } from '@atlaskit/react-ufo/custom-spans';

async function fetchData() {
	const start = performance.now();
	const data = await api.getData();
	addCustomSpans('api-fetch', start, performance.now(), data.length);
	return data;
}
```

### addBM3TimingsToUFO

Converts BM3 (Browser Metrics 3) timing marks into UFO custom timings. Useful for migrating from BM3
instrumentation to UFO.

**Import:**

```typescript
import { addBM3TimingsToUFO } from '@atlaskit/react-ufo/custom-timings';
```

**Signature:**

```typescript
function addBM3TimingsToUFO(
	marks?: { [key: string]: number },
	timingsConfig?: Array<{ key: string; startMark?: string; endMark?: string }>,
): void;
```

**Also available as a component:**

```typescript
import { UFOBM3TimingsToUFO } from '@atlaskit/react-ufo/custom-timings';

<UFOBM3TimingsToUFO marks={marks} timings={timingsConfig} />
```

### addFeatureFlagAccessed

Records feature flag usage for correlation with performance metrics.

**Import:**

```typescript
import { addFeatureFlagAccessed } from '@atlaskit/react-ufo/feature-flags-accessed';
```

**Signature:**

```typescript
function addFeatureFlagAccessed(featureFlagName: string, featureFlagValue: FeatureFlagValue): void;
```

**Example:**

```typescript
import { addFeatureFlagAccessed } from '@atlaskit/react-ufo/feature-flags-accessed';

function checkFeatureFlag(flagKey) {
	const flagValue = fg(flagKey);
	addFeatureFlagAccessed(flagKey, flagValue);
	return flagValue;
}
```

**Note:** Use cautiously as recording all feature flags can significantly increase payload size.

### setInteractionError

Manually records an error for a specific named interaction.

**Import:**

```typescript
import { setInteractionError } from '@atlaskit/react-ufo/set-interaction-error';
```

**Signature:**

```typescript
function setInteractionError(
	interactionName: string,
	error: { errorMessage: string; name: string },
): void;
```

**Example:**

```typescript
import { setInteractionError } from '@atlaskit/react-ufo/set-interaction-error';

function loadIssueData(issueId) {
	try {
		return loadIssue(issueId);
	} catch (error) {
		setInteractionError('issue-view', {
			errorMessage: error.message,
			name: 'IssueLoadError',
		});
		throw error;
	}
}
```

### setTerminalError

Reports a terminal (critical) error to UFO. Terminal errors represent failures that prevent the user
from completing their task, such as errors caught by error boundaries.

**Import:**

```typescript
import { setTerminalError } from '@atlaskit/react-ufo/set-terminal-error';
```

**Signature:**

```typescript
function setTerminalError(
	error: Error,
	additionalAttributes?: TerminalErrorAdditionalAttributes,
	labelStack?: LabelStack,
): void;
```

**`TerminalErrorAdditionalAttributes`:**

| Property               | Type                           | Description                                                      |
| ---------------------- | ------------------------------ | ---------------------------------------------------------------- |
| `teamName`             | `string`                       | Team responsible for the component                               |
| `packageName`          | `string`                       | Package where the error occurred                                 |
| `errorBoundaryId`      | `string`                       | Identifier of the error boundary                                 |
| `errorHash`            | `string`                       | Custom error identifier for grouping                             |
| `traceId`              | `string`                       | Trace ID for distributed tracing                                 |
| `fallbackType`         | `'page' \| 'flag' \| 'custom'` | Type of fallback rendered                                        |
| `statusCode`           | `number`                       | HTTP status code if applicable                                   |
| `isClientNetworkError` | `boolean`                      | Whether this is a client network error (excluded from reporting) |

**Example:**

```typescript
import { setTerminalError } from '@atlaskit/react-ufo/set-terminal-error';

class AppErrorBoundary extends React.Component {
	componentDidCatch(error) {
		setTerminalError(error, {
			errorBoundaryId: 'app-root',
			fallbackType: 'page',
			teamName: 'my-team',
			packageName: '@atlassian/my-app',
		});
	}
}
```

### sinkTerminalErrorHandler

Registers a handler function that is called when terminal errors are reported via
`setTerminalError`. This is used to configure how terminal error data is consumed (e.g., sent to
analytics).

**Import:**

```typescript
import { sinkTerminalErrorHandler } from '@atlaskit/react-ufo/set-terminal-error';
```

**Signature:**

```typescript
function sinkTerminalErrorHandler(
	fn: (errorData: TerminalErrorData, context: TerminalErrorContext) => void | Promise<void>,
): void;
```

The `TerminalErrorContext` provides information about the interaction state when the error occurred,
including the active and previous interaction names, IDs, and types.

### getUFORouteName

Extracts the UFO name from a route configuration object. Returns `ufoName` if defined, otherwise
falls back to `name`.

**Import:**

```typescript
import getUFORouteName from '@atlaskit/react-ufo/route-name';
```

**Signature:**

```typescript
function getUFORouteName(route: { ufoName?: string; name: string }): string;
```

**Example:**

```typescript
import getUFORouteName from '@atlaskit/react-ufo/route-name';
import { useRouter } from '@atlassian/react-resource-router';

function RouteAnalytics() {
	const [routerState] = useRouter();
	const ufoName = getUFORouteName(routerState.route);

	useEffect(() => {
		if (ufoName) {
			console.log('Current UFO route:', ufoName);
		}
	}, [ufoName]);

	return null;
}
```

### updatePageloadName

Updates the UFO name of an active page load or transition interaction. Useful when the route name
isn't known at the time `traceUFOPageLoad` is first called.

**Import:**

```typescript
import { updatePageloadName } from '@atlaskit/react-ufo/trace-pageload';
```

**Signature:**

```typescript
function updatePageloadName(
	ufoName: string,
	routeName?: string | null | undefined, // defaults to ufoName
): void;
```

**Example:**

```typescript
import { updatePageloadName } from '@atlaskit/react-ufo/trace-pageload';

function RouteResolver({ routeName }) {
	useEffect(() => {
		if (routeName) {
			updatePageloadName(routeName);
		}
	}, [routeName]);

	return null;
}
```

---

## Component Integration

### interactionName Property

Many Atlassian Design System components support an `interactionName` prop that automatically adds
UFO tracking.

**@atlaskit/button:**

```typescript
import Button from '@atlaskit/button';

// Triggers a UFO press interaction on click
<Button interactionName="save-issue" onClick={handleSave}>
  Save
</Button>
```

When no `interactionName` is provided, the button defaults to `unknown`. Unknown interactions are
tracked for volume purposes but are **not** aggregated into metrics.

**@atlaskit/spinner:**

```typescript
import Spinner from '@atlaskit/spinner';

// Adds a UFO hold while the spinner is mounted
<Spinner interactionName="loading-comments" size="medium" />
```

---

## Advanced APIs

### SSR Configuration

Configure UFO for Server-Side Rendering scenarios. This produces a more accurate FMP metric.

**Import:**

```typescript
import { configure } from '@atlaskit/react-ufo/ssr';
```

**Signature:**

```typescript
type SSRConfig = {
	getDoneMark: () => number | null;
	getFeatureFlags: () => SSRFeatureFlags | null;
	getTimings?: () => ReportedTimings | null;
	getSsrPhaseSuccess?: () => {
		prefetch?: boolean;
		earlyFlush?: boolean;
		done?: boolean;
	};
};

function configure(ssrConfig: SSRConfig): void;
```

**Configuration Options:**

- `getDoneMark()`: Returns timestamp when SSR rendering completed
- `getFeatureFlags()`: Returns feature flags used during SSR
- `getTimings()`: Returns detailed SSR timing breakdown
- `getSsrPhaseSuccess()`: Returns success status for each SSR phase

**Additional SSR exports:**

```typescript
import {
	getSSRTimings,
	getSSRSuccess,
	getSSRPhaseSuccess,
	getSSRDoneTime,
	getSSRFeatureFlags,
} from '@atlaskit/react-ufo/ssr';
```

### Configuration

Set the global UFO configuration for your product.

**Import:**

```typescript
import { setUFOConfig, getConfig, isUFOEnabled } from '@atlaskit/react-ufo/config';
```

**Key configuration fields:**

| Field                                          | Type                     | Description                                                 |
| ---------------------------------------------- | ------------------------ | ----------------------------------------------------------- |
| `enabled`                                      | `boolean`                | Whether UFO is enabled                                      |
| `product`                                      | `string`                 | Product identifier (e.g., `'jira'`, `'confluence'`)         |
| `region`                                       | `string`                 | Deployment region                                           |
| `rates`                                        | `Rates`                  | Sampling rates for different interaction types              |
| `interactionTimeout`                           | `Record<string, number>` | Custom timeouts per interaction                             |
| `minorInteractions`                            | `string[]`               | Interactions classified as minor                            |
| `doNotAbortActivePressInteraction`             | `string[]`               | Press interactions that should not be aborted               |
| `doNotAbortActivePressInteractionOnTransition` | `string[]`               | Press interactions that should not be aborted on transition |
| `finishInteractionOnTransition`                | `string[]`               | Interactions to finish (not abort) on transition            |
| `vc`                                           | `object`                 | Visual Completion observer configuration                    |
| `terminalErrors`                               | `object`                 | Terminal error reporting configuration                      |

### Experience Trace ID Context

Manage distributed tracing context for UFO interactions. Enables correlation of frontend performance
data with backend traces.

**Import:**

```typescript
import {
	getActiveTrace,
	setActiveTrace,
	clearActiveTrace,
	getActiveTraceHttpRequestHeaders,
	getActiveTraceAsQueryParams,
} from '@atlaskit/react-ufo/experience-trace-id-context';
```

**Key Functions:**

- `getActiveTrace()`: Returns the current active trace context
- `setActiveTrace(traceId, spanId, type)`: Sets the active trace
- `clearActiveTrace()`: Clears the active trace
- `getActiveTraceHttpRequestHeaders(url?)`: Returns `X-B3-TraceId` and `X-B3-SpanId` headers for
  HTTP requests
- `getActiveTraceAsQueryParams(url?)`: Returns trace context as query parameters

---

## Best Practices

### Naming Conventions

- Use descriptive, specific names: `issue-header` not `header`
- Use kebab-case for consistency
- Include context when helpful: `board-issue-card` vs `issue-card`
- Avoid dynamic values in names

### Performance Considerations

- Don't over-instrument — focus on key user journeys
- Use segments for logical page sections (like header, content, sidebar)
- Be selective with custom data to avoid large payloads
- Prefer component-level holds over page-level holds for granular tracking
- Use `UFOThirdPartySegment` for external content that may impact performance
- Use `UFOInteractionIgnore` for non-critical components that load late

### Interaction Lifecycle

1. An interaction starts via `traceUFOPageLoad`, `traceUFOTransition`, `traceUFOPress`, or
   `traceUFOHover`
2. `UFOLoadHold` components register active holds that prevent completion
3. The interaction completes (TTAI) at the next paint after all holds are released
4. VC metrics are calculated based on viewport mutations during the interaction window
5. Only one interaction can be active at a time — new interactions abort previous ones

### Feature Gating

All changes to React UFO should use feature gates:

```typescript
import { fg } from '@atlaskit/platform-feature-flags';

if (fg('my_feature_gate')) {
	// New behavior
} else {
	// Existing behavior
}
```

Register feature gates in `package.json` under `platform-feature-flags`.

---

## Common Patterns

### Page Load Tracking

```typescript
function MyPage() {
  useEffect(() => {
    traceUFOPageLoad('my-page');
  }, []);

  return (
    <UFOSegment name="main-content">
      <PageContent />
    </UFOSegment>
  );
}
```

### Loading States

```typescript
function DataComponent() {
  const [loading, setLoading] = useState(true);

  return (
    <UFOSegment name="data-section">
      {loading ? (
        <UFOLoadHold name="data-loading">
          <Skeleton />
        </UFOLoadHold>
      ) : (
        <DataTable />
      )}
    </UFOSegment>
  );
}
```

### Navigation Tracking

```typescript
function NavigationWrapper() {
  const [routerState] = useRouter();

  useEffect(() => {
    const ufoName = getUFORouteName(routerState.route);
    if (ufoName) {
      traceUFOTransition(ufoName);
    }
  }, [routerState]);

  return <Router />;
}
```

### Error Boundary with Terminal Error Reporting

```typescript
import { useReportTerminalError } from '@atlaskit/react-ufo/set-terminal-error';

function ErrorBoundaryFallback({ error }) {
  useReportTerminalError(error, {
    errorBoundaryId: 'main-content',
    fallbackType: 'page',
    teamName: 'my-team',
  });

  return <ErrorPage message="Something went wrong" />;
}
```

---

## Troubleshooting

### Common Issues

**Interaction Never Completes**

- Check for holds that are never released (components that mount `UFOLoadHold` but never unmount)
- Verify all async operations complete properly
- Ensure error boundaries don't prevent holds from releasing
- Use `UFOInteractionIgnore` for non-critical components that load late

**Missing Analytics Events**

- Verify UFO configuration is properly set up via `setUFOConfig`
- Check that sampling rates are configured for your interaction names
- Ensure you're calling trace functions early in the component lifecycle

**Aborted Interactions**

- Only one interaction can be active at a time
- A new press interaction aborts the previous interaction
- Aborted interactions do **not** report metrics to prevent data skewing
- Check `doNotAbortActivePressInteraction` config if your interaction is unexpectedly aborted

**Performance Impact**

- Avoid over-instrumentation — focus on critical user journeys
- Use feature flags to control UFO instrumentation in production
- Monitor payload sizes if adding extensive custom data

**SSR Compatibility**

- Use the SSR configuration APIs for server-side rendered applications
- Confluence uses `window.performance.mark("CFP-63.ssr-ttr")` for SSR timing via `getDoneMark`
- Test SSR placeholder behavior with your specific setup

---

## Additional Resources

- [React UFO Overview](https://hello.atlassian.net/wiki/spaces/UFO/pages/2305847386/react-ufo+UFO+v2)
- [How React UFO calculates metrics](https://hello.atlassian.net/wiki/spaces/APD/pages/5046492124)
- [React UFO Contribution Guidelines](https://hello.atlassian.net/wiki/spaces/APD/pages/4717459313)
- [Press Interactions Overview](https://hello.atlassian.net/wiki/spaces/APD/pages/5770720615)
- [Interactivity Metrics](https://hello.atlassian.net/wiki/spaces/APD/pages/5026355203)
- [React UFO for Platform Components](https://hello.atlassian.net/wiki/spaces/APD/pages/6170852473)
- [React UFO: A Deeper Understanding](https://hello.atlassian.net/wiki/spaces/UFO/blog/2022/12/16/2280380649/react-UFO+A+deeper+understanding+of+performance)
