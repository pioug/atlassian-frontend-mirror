---
title: React-UFO - Instrumentation API Reference
description: 'Complete API reference for @atlaskit/react-ufo performance instrumentation'
platform: platform
product: ufo
category: devguide
subcategory: react-ufo
date: '2025-11-10'
---

# React UFO Instrumentation API Reference

React UFO provides performance instrumentation components and utilities to measure user experience
metrics across Atlassian products. This library captures key performance indicators like Time to
Interactive (TTI), Time to Visual Complete (TTVC), and custom interaction metrics.

## Getting Started

```bash
yarn add @atlaskit/react-ufo
```

## API Reference

### Interaction Initializers

- [traceUFOPageLoad](#traceufopageload)
- [traceUFOPress](#traceufopress)
- [traceUFOTransition](#traceufotransition)
- [traceUFOInteraction](#traceufointeraction)
- [traceUFORedirect](#traceuforedirect)

### React Components

- [UFOSegment](#ufosegment)
- [UFOLabel](#ufolabel)
- [UFOLoadHold](#ufoloadhold)
- [Suspense](#suspense)
- [UFOCustomData](#ufocustomdata)
- [UFOCustomCohortData](#ufocustomcohortdata) ⚠️ Experimental

### React Hooks

- [usePressTracing](#usepresstracing)
- [useUFOTypingPerformanceTracing](#useufotypingperformancetracing) ⚠️ Experimental
- [useUFOTransitionCompleter](#useufotransitioncompleter)
- [useUFOReportError](#useuforeporterror)

### Utility Functions

- [addUFOCustomData](#addufocustomdata)
- [addUFOCustomCohortData](#addufocustomcohortdata) ⚠️ Experimental
- [addFeatureFlagAccessed](#addfeatureflagaccessed)
- [setInteractionError](#setinteractionerror)
- [getUFORouteName](#getuforoutename)

### Component Integration

- [interactionName Property](#interactionname)

### Advanced APIs

- [SSR Configuration](#ssr-configuration)
- [VC (Visual Completion) Observer](#vc-observer)
- [Third-Party Segments](#third-party-segments)

---

## Interaction Initializers

### traceUFOPageLoad

Initializes measurement of page load performance for a specific route or page. This function should
be called early in the page lifecycle to capture accurate timing data.

**Import:**

```typescript
import traceUFOPageLoad from '@atlaskit/react-ufo/trace-pageload';
```

**Usage:**

```typescript
traceUFOPageLoad('issue-view');
```

**Parameters:**

- `ufoName` (string): The UFO interaction name used for sampling and event identification

**Example:**

```typescript
// In your route component
import { useEffect } from 'react';
import traceUFOPageLoad from '@atlaskit/react-ufo/trace-pageload';

function IssueView() {
	useEffect(() => {
		traceUFOPageLoad('issue-view');
	}, []);

	return <div>Issue content...</div>;
}
```

**Note:** The function uses sampling rates configured in your UFO settings to control which page
loads are measured.

### traceUFOPress

Measures user interaction performance from a press/click event until all loading is complete. Use
this when `usePressTracing` hook or the `interactionName` property on components isn't suitable.

**Import:**

```typescript
import traceUFOPress from '@atlaskit/react-ufo/trace-press';
```

**Usage:**

```typescript
traceUFOPress('button-click');
traceUFOPress('menu-open', performance.now()); // with custom timestamp
```

**Parameters:**

- `name` (string): Unique identifier for the interaction
- `timestamp` (number, optional): Custom timestamp, defaults to `performance.now()`

**Example:**

```typescript
import traceUFOPress from '@atlaskit/react-ufo/trace-press';

function CustomButton() {
	const handleClick = () => {
		traceUFOPress('custom-action');
		// Trigger your action that may cause loading states
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
single-page application. This function aborts active interactions and starts measuring the new
transition.

**Import:**

```typescript
import traceUFOTransition from '@atlaskit/react-ufo/trace-transition';
```

**Usage:**

```typescript
traceUFOTransition('board-to-backlog');
```

**Parameters:**

- `ufoName` (string): The UFO name for the transition

**Example:**

```typescript
import { useRouter } from '@atlassian/react-resource-router';
import traceUFOTransition from '@atlaskit/react-ufo/trace-transition';

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

Measures performance of user interactions based on browser events. This function automatically
detects the interaction type from the event and applies appropriate timing.

**Import:**

```typescript
import traceUFOInteraction from '@atlaskit/react-ufo/trace-interaction';
```

**Usage:**

```typescript
traceUFOInteraction('dropdown-open', event);
```

**Parameters:**

- `name` (string): Unique identifier for the interaction
- `event` (Event | UIEvent): Browser event object (must be trusted)

**Supported Event Types:**

- `click`
- `dblclick`
- `mousedown`
- `mouseenter`
- `mouseover`

**Example:**

```typescript
import traceUFOInteraction from '@atlaskit/react-ufo/trace-interaction';

function InteractiveComponent() {
	const handleClick = (event: React.MouseEvent) => {
		traceUFOInteraction('component-action', event.nativeEvent);

		// Your interaction logic
		setShowModal(true);
	};

	return <div onClick={handleClick}>Click me</div>;
}
```

**Notes:**

- Only trusted events (user-initiated) are processed
- Unsupported event types are ignored
- Event timestamp is automatically extracted from the event object

### traceUFORedirect

Specialized function for tracking navigation between routes, providing detailed route transition
information. This is typically used with routing libraries like `@atlassian/react-resource-router`.

**Import:**

```typescript
import traceUFORedirect from '@atlaskit/react-ufo/trace-redirect';
import getUFORouteName from '@atlaskit/react-ufo/route-name';
```

**Usage:**

```typescript
traceUFORedirect(fromUfoName, nextUfoName, nextRouteName, timestamp);
```

**Parameters:**

- `fromUfoName` (string): Current route UFO name
- `nextUfoName` (string): Target route UFO name from route config
- `nextRouteName` (string): Target route name from route definition
- `time` (number): High-precision timestamp from `performance.now()`

**Example with React Resource Router:**

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

	return null; // This is typically a side-effect component
}
```

**Use Cases:**

- Single-page application route changes
- Cross-product navigation
- Complex navigation patterns requiring detailed tracking

---

## React Components

### UFOSegment

A React context provider that defines distinct, measurable sections of your application. Each
segment generates its own performance payload, allowing granular analysis of different page areas.

**Import:**

```typescript
import UFOSegment from '@atlaskit/react-ufo/segment';
```

**Basic Usage:**

```typescript
<UFOSegment name="sidebar">
	<SidebarComponent />
</UFOSegment>
```

**Parameters:**

- `name` (string): Unique identifier for this page segment
- `children` (ReactNode): Components to be measured within this segment

**Real-world Example:**

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
- Avoid generic names like "content" or "main" - be specific
- Segments with identical names are aggregated in analytics
- Nesting is supported but use judiciously

**Third-Party Extensions:**

```typescript
import { UFOThirdPartySegment } from '@atlaskit/react-ufo/segment';

// For external/plugin content that should be tracked separately
<UFOThirdPartySegment name="confluence-macro-calendar">
	<CalendarMacro />
</UFOThirdPartySegment>;
```

### UFOLabel

A React context provider used to annotate sections of your component tree with descriptive names.
Unlike segments, labels don't generate separate events but provide context for debugging and
analysis.

**Import:**

```typescript
import UFOLabel from '@atlaskit/react-ufo/label';
```

**Usage:**

```typescript
<UFOLabel name="welcome_banner">
	<Text>Hello folks</Text>
</UFOLabel>
```

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

- Use static strings only - no dynamic values
- Focus on being distinct rather than semantically perfect
- No need to label every component - use judiciously
- Helps with debugging performance issues in specific UI areas

### UFOLoadHold

Identifies loading elements and prevents interaction completion until they are no longer visible to
the user. This component is crucial for accurate TTI (Time to Interactive) measurements.

**Import:**

```typescript
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
```

**Usage Patterns:**

**1. Wrapping loading elements:**

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

**3. Conditional wrapping:**

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

**Parameters:**

- `name` (string): Unique identifier for this loading state
- `hold` (boolean, optional): Controls whether the hold is active
- `children` (ReactNode, optional): Components wrapped by the hold

**Real-world Examples:**

```typescript
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';

// Loading skeleton
function IssueCard({ issue }) {
	if (!issue) {
		return (
			<UFOLoadHold name="issue-card-loading">
				<IssueCardSkeleton />
			</UFOLoadHold>
		);
	}

	return <IssueCardContent issue={issue} />;
}

// Conditional loading
function CommentsSection({ loading, comments }) {
	return (
		<div>
			<UFOLoadHold name="comments-loading" hold={loading} />
			{loading ? <CommentsSkeleton /> : <CommentsList comments={comments} />}
		</div>
	);
}
```

**Notes:**

- Only instrument loading elements once if they're reused
- Multiple holds with the same name are fine
- Holds automatically release when component unmounts

### Suspense

An enhanced Suspense boundary that provides UFO instrumentation. Use this as a drop-in replacement
for React's `Suspense` component.

**Import:**

```typescript
import Suspense from '@atlaskit/react-ufo/suspense';
```

**Usage:**

```typescript
<Suspense name="lazy-component" fallback={<Skeleton />}>
	<LazyComponent />
</Suspense>
```

**Parameters:**

- `name` (string): Unique identifier for this suspense boundary
- `fallback` (ReactNode): Component to show while suspended
- `children` (ReactNode): Components that might suspend

**Example:**

```typescript
import Suspense from '@atlaskit/react-ufo/suspense';

const LazyIssueView = lazy(() => import('./IssueView'));

function App() {
	return (
		<Suspense name="issue-view-lazy" fallback={<IssueViewSkeleton />}>
			<LazyIssueView />
		</Suspense>
	);
}
```

### UFOCustomData

Adds custom metadata to the current UFO interaction. This data appears in analytics events with a
"custom:" prefix.

**Import:**

```typescript
import UFOCustomData from '@atlaskit/react-ufo/custom-data';
```

**Usage:**

```typescript
<UFOCustomData data={{ viewType: 'list', itemCount: 42 }} />
```

**Example:**

```typescript
import UFOCustomData from '@atlaskit/react-ufo/custom-data';

function IssueList({ issues, viewType }) {
	const customData = {
		viewType,
		issueCount: issues.length,
		hasFilters: filters.length > 0,
	};

	return (
		<div>
			<UFOCustomData data={customData} />
			<IssueTable issues={issues} />
		</div>
	);
}
```

**Output in analytics:**

```javascript
{
  'custom:viewType': 'list',
  'custom:issueCount': 42,
  'custom:hasFilters': true
}
```

### UFOCustomCohortData ⚠️ Experimental

**Note: This is an experimental feature that may change or be removed in future versions.**

Adds cohort-specific custom data to UFO interactions. This is used for A/B testing and feature flag
correlation.

**Import:**

```typescript
import UFOCustomCohortData from '@atlaskit/react-ufo/custom-cohort-data';
```

**Usage:**

```typescript
<UFOCustomCohortData dataKey="experiment_variant" value="control" />
```

**Example:**

```typescript
import UFOCustomCohortData from '@atlaskit/react-ufo/custom-cohort-data';
import { fg } from '@atlassian/jira-feature-gating';

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

---

## React Hooks

### usePressTracing

A hook that provides a function to trace user press interactions. Use this for custom components
that need interaction tracking.

**Import:**

```typescript
import usePressTracing from '@atlaskit/react-ufo/use-press-tracing';
```

**Usage:**

```typescript
const traceInteraction = usePressTracing('custom-button-click');
```

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

**Parameters:**

- `name` (string): The UFO interaction name

**Returns:**

- `traceInteraction` (function): Function to call when interaction starts
  - `timeStamp` (number, optional): Custom timestamp

**Note:** Results are sent as `inline-result` type events.

### useUFOTypingPerformanceTracing ⚠️ Experimental

**Note: This is an experimental feature that may change or be removed in future versions.**

Measures typing latency in input fields to track user experience during text input.

**Import:**

```typescript
import useUFOTypingPerformanceTracing from '@atlaskit/react-ufo/typing-performance-tracing';
```

**Usage:**

```typescript
const typingRef = useUFOTypingPerformanceTracing<HTMLInputElement>('text-input-typing');
```

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
components.

**Import:**

```typescript
import { useUFOTransitionCompleter } from '@atlaskit/react-ufo/trace-transition';
```

**Usage:**

```typescript
function MyPageComponent() {
	useUFOTransitionCompleter();

	return <div>Page content</div>;
}
```

**Example:**

```typescript
import { useUFOTransitionCompleter } from '@atlaskit/react-ufo/trace-transition';

function IssueViewPage() {
	// This will complete any active transition when the page renders
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

A hook that provides a function to report errors within UFO interactions. This allows you to capture
and track errors that occur during performance-critical user flows.

**Import:**

```typescript
import { useUFOReportError } from '@atlaskit/react-ufo/report-error';
```

**Usage:**

```typescript
const reportError = useUFOReportError();
```

**Parameters:**

- None

**Returns:**

- `reportError` (function): Function to report errors to the current UFO interaction
  - `error` (object): Error information with the following properties:
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
			throw error; // Re-throw for component error handling
		}
	};

	// Component logic...
}
```

**Advanced Example with Context:**

```typescript
import { useUFOReportError } from '@atlaskit/react-ufo/report-error';

function SearchComponent() {
	const reportError = useUFOReportError();

	const handleSearchError = (error, searchContext) => {
		reportError({
			name: 'SearchAPIError',
			errorMessage: `Search failed: ${error.message}`,
			errorStack: error.stack,
			errorStatusCode: error.response?.status,
			// Custom error hash for grouping similar errors
			errorHash: `search-${searchContext.query}-${error.type}`,
		});
	};

	return <div>{/* Search UI */}</div>;
}
```

**Notes:**

- Errors are automatically associated with the currently active UFO interaction
- If no interaction is active, errors are added to all active interactions
- Use meaningful error names for better categorization in analytics
- Include stack traces when possible for debugging

---

## Utility Functions

### addUFOCustomData

Programmatically adds custom data to the current UFO interaction without using a component.

**Import:**

```typescript
import { addUFOCustomData } from '@atlaskit/react-ufo/custom-data';
```

**Usage:**

```typescript
addUFOCustomData({ key: 'value', count: 42 });
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

### addUFOCustomCohortData ⚠️ Experimental

**Note: This is an experimental feature that may change or be removed in future versions.**

Programmatically adds cohort data for A/B testing and feature flag tracking.

**Import:**

```typescript
import { addUFOCustomCohortData } from '@atlaskit/react-ufo/custom-cohort-data';
```

**Usage:**

```typescript
addUFOCustomCohortData('feature_flag_key', true);
```

**Example:**

```typescript
import { addUFOCustomCohortData } from '@atlaskit/react-ufo/custom-cohort-data';
import { fg } from '@atlassian/jira-feature-gating';

function initializeExperiment() {
	const isNewDesignEnabled = fg('new_design_system');

	addUFOCustomCohortData('design_system_version', isNewDesignEnabled ? 'v2' : 'v1');
	addUFOCustomCohortData('user_segment', getUserSegment());
}
```

### addFeatureFlagAccessed

Records feature flag usage for correlation with performance metrics.

**Import:**

```typescript
import { addFeatureFlagAccessed } from '@atlaskit/react-ufo/feature-flags-accessed';
```

**Usage:**

```typescript
addFeatureFlagAccessed('feature_flag_name', flagValue);
```

**Example:**

```typescript
import { addFeatureFlagAccessed } from '@atlaskit/react-ufo/feature-flags-accessed';
import { fg } from '@atlassian/jira-feature-gating';

function checkFeatureFlag(flagKey) {
	const flagValue = fg(flagKey);

	// Record this flag access for performance correlation
	if (shouldRecordFeatureFlagForUFO(flagKey)) {
		addFeatureFlagAccessed(flagKey, flagValue);
	}

	return flagValue;
}
```

**Note:** Use cautiously as recording all feature flags can significantly increase payload size.

### setInteractionError

Manually records an error for the current UFO interaction.

**Import:**

```typescript
import { setInteractionError } from '@atlaskit/react-ufo/set-interaction-error';
```

**Usage:**

```typescript
setInteractionError('interaction-name', {
	errorMessage: 'Something went wrong',
	name: 'CustomError',
});
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

### getUFORouteName

Extracts the UFO name from a route configuration object.

**Import:**

```typescript
import getUFORouteName from '@atlaskit/react-ufo/route-name';
```

**Usage:**

```typescript
const ufoName = getUFORouteName(route);
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

---

## Component Integration

### interactionName Property

Many Atlassian Design System components support an `interactionName` prop that automatically adds
UFO tracking.

**Supported Components:**

**@atlaskit/button:**

```typescript
import Button from '@atlaskit/button';

<Button interactionName="save-issue">Save</Button>;
```

**@atlaskit/spinner:**

```typescript
import Spinner from '@atlaskit/spinner';

<Spinner interactionName="loading-comments" size="medium" />;
```

**Examples:**

```typescript
// Button with interaction tracking
<Button interactionName="create-issue" onClick={handleCreateIssue}>
	Create Issue
</Button>;

// Spinner that holds interaction until unmounted
{
	isLoading && <Spinner interactionName="issue-loading" size="large" />;
}
```

**Notes:**

- Button: Triggers a UFO press interaction on click
- Spinner: Adds a UFO hold while the spinner is mounted
- Use descriptive, unique names for each interaction

---

## Advanced APIs

### SSR Configuration

Configure UFO for Server-Side Rendering scenarios. This will produce a more accurate FMP Topline
Metric in Glance.

**Import:**

```typescript
import { configure } from '@atlaskit/react-ufo/ssr';
```

**Usage:**

```typescript
configure({
	getDoneMark: () => performance.now(),
	getFeatureFlags: () => ({ flag1: true, flag2: false }),
	getTimings: () => ({
		total: { startTime: 0, duration: 1200 },
		render: { startTime: 100, duration: 800 },
	}),
	getSsrPhaseSuccess: () => ({
		prefetch: true,
		earlyFlush: true,
		done: true,
	}),
});
```

**Configuration Options:**

- `getDoneMark()`: Returns timestamp when SSR rendering completed
- `getFeatureFlags()`: Returns feature flags used during SSR
- `getTimings()`: Returns detailed SSR timing breakdown
- `getSsrPhaseSuccess()`: Returns success status for SSR phases

### Third-Party Segments

Special segment type for tracking external or plugin content separately from first-party code.

**Import:**

```typescript
import { UFOThirdPartySegment } from '@atlaskit/react-ufo/segment';
```

**Usage:**

```typescript
<UFOThirdPartySegment name="external-calendar-widget">
	<CalendarWidget />
</UFOThirdPartySegment>
```

**Use Cases:**

- External service integrations
- Third-party plugins or widgets
- Partner-provided components
- Any content not directly controlled by your team

---

## Best Practices

### Naming Conventions

- Use descriptive, specific names: `issue-header` not `header`
- Use kebab-case for consistency
- Include context when helpful: `board-issue-card` vs `issue-card`
- Avoid dynamic values in names

### Performance Considerations

- Don't over-instrument - focus on key user journeys
- Use segments for logical page sections (like header, content, sidebar)
- Be selective with custom data to avoid large payloads
- Prefer component-level holds over page-level holds for granular tracking
- Use meaningful, descriptive names that help identify performance bottlenecks
- Consider using UFOThirdPartySegment for external content that may impact performance

### Debugging

- Use browser dev tools to inspect UFO events
- Check network tab for UFO payload requests (look for analytics events)
- Use UFO labels to identify problematic code areas
- Monitor UFO events in your application's analytics dashboard
- Enable verbose logging in development to see interaction lifecycle
- Use meaningful names for segments and holds to quickly identify issues
- Test with feature flags to ensure performance tracking works across variants
- Pay attention to "holds" that never release - they prevent interactions from completing

### Migration Guide

- Use `interactionName` props on ADS components when possible
- Migrate from manual event tracking to UFO components
- Consider SSR implications when adding new instrumentation

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

## Troubleshooting

### Common Issues

**Interaction Never Completes**

- Check for holds that are never released (components that mount `UFOLoadHold` but never unmount)
- Verify all async operations complete properly
- Ensure error boundaries don't prevent holds from releasing

**Missing Analytics Events**

- Verify UFO configuration is properly set up in your application
- Check that sampling rates are configured for your interaction names
- Ensure you're calling trace functions early in the component lifecycle

**Performance Impact**

- Avoid over-instrumentation - focus on critical user journeys
- Use feature flags to control UFO instrumentation in production
- Monitor payload sizes if adding extensive custom data

**SSR Compatibility**

- Use the SSR configuration APIs for server-side rendered applications
- Ensure UFO components handle server-side rendering gracefully
- Test SSR placeholder behavior with your specific setup
