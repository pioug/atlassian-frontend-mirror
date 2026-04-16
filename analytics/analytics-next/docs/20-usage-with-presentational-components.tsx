/* eslint-disable @atlaskit/design-system/use-primitives-text, @atlaskit/design-system/use-heading, @atlaskit/design-system/no-html-anchor -- Legacy analytics-next docs intentionally use plain HTML prose, tables, and links instead of ADS docs primitives. */
import React from 'react';

import { CodeBlock } from './DocBlocks';

const useAnalyticsEventsCode = `
import React, { useCallback } from 'react';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

const MyButton = ({ onClick = () => {} }) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handler = useCallback((clickEvent) => {
    const analyticsEvent = createAnalyticsEvent({
      action: 'clicked',
      componentName: 'my-button',
      packageName: '@atlaskit/my-button',
      packageVersion: '1.0.0'
    });

    const clonedEvent = analyticsEvent.clone();
    analyticsEvent.fire("atlaskit");
    onClick(clickEvent, clonedEvent);
  }, [ createAnalyticsEvent, onClick ]);

  return (
    <button onClick={handler}>Track me</button>
  );
}

export MyButton;
`;

const useCallbackWithAnalyticsCode = `
import React, { useCallback } from 'react';
import { useCallbackWithAnalytics } from '@atlaskit/analytics-next';

const MyButton = ({ onClick = () => {} }) => {
  const handler = useCallbackWithAnalytics(onClick, {
    action: 'clicked',
    componentName: 'my-button',
    packageName: '@atlaskit/my-button',
    packageVersion: '1.0.0'
  }, 'atlaskit');

  return (
    <button onClick={handler}>Track me</button>
  );
}

export MyButton;
`;

const hocManualCode = `
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

const MyButton = ({ onClick = () => {}, createAnalyticsEvent }) => {
  const handler = (clickEvent) => {
    const analyticsEvent = createAnalyticsEvent({
      action: 'clicked',
      componentName: 'my-button',
      packageName: '@atlaskit/my-button',
      packageVersion: '1.0.0'
    });

    const clonedEvent = analyticsEvent.clone();
    analyticsEvent.fire("atlaskit");
    onClick(clickEvent, clonedEvent);
  };

  return (
    <button onClick={handler}>Track me</button>
  );
}

const AnalyticsWrappedButton = withAnalyticsEvents()(MyButton);

export AnalyticsWrappedButton;
`;

const hocMappedCode = `
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

const MyButton = ({ onClick = () => {} }) => {
  const handler = (clickEvent, analyticsEvent) => {
    const clonedEvent = analyticsEvent.clone();
    analyticsEvent.fire("atlaskit");
    onClick(clickEvent, clonedEvent);
  };

  return (
    <button onClick={handler}>Track me</button>
  );
}

const AnalyticsWrappedButton = withAnalyticsEvents({
  onClick: (createAnalyticsEvent) => createAnalyticsEvent({
    action: 'clicked',
    componentName: 'my-button',
    packageName: '@atlaskit/my-button',
    packageVersion: '1.0.0'
  })
})(MyButton);

export AnalyticsWrappedButton;
`;

const hocShorthandCode = `
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

const MyButton = ({ onClick = () => {} }) => {
  const handler = (clickEvent, analyticsEvent) => {
    const clonedEvent = analyticsEvent.clone();
    analyticsEvent.fire("atlaskit");
    onClick(clickEvent, clonedEvent);
  };

  return (
    <button onClick={handler}>Track me</button>
  );
}

const AnalyticsWrappedButton = withAnalyticsEvents({
  onClick: {
    action: 'clicked',
    componentName: 'my-button',
    packageName: '@atlaskit/my-button',
    packageVersion: '1.0.0'
  }
})(MyButton);

export AnalyticsWrappedButton;
`;

const leafHandlersCode = `
import React, { useCallback } from 'react';
import {
  usePlatformLeafEventHandler,
  usePlatformLeafSyntheticEventHandler
} from '@atlaskit/analytics-next';

const MyButton = ({ onClick = () => {}, onActivate = () => {}}) => {
  const wrapped = (clickEvent, analyticsEvent) => {
    const clonedEvent = analyticsEvent.clone();
    analyticsEvent.fire("otherChannel");
    onClick(clickEvent, clonedEvent);
  };
  const handler = usePlatformLeafEventHandler({
    fn: wrapped,
    action: 'clicked',
    componentName: 'my-button',
    actionSubject : 'clickButton',
    packageName: '@atlaskit/my-button',
    packageVersion: '1.0.0',
    analyticsData: {
      style: 'fancy'
    },
  });

  const wrappedSynthetic = (analyticsEvent) => {
    const clonedEvent = analyticsEvent.clone();
    analyticsEvent.fire("otherChannel");
    onActivate(clonedEvent);
  };
  const syntheticHandler = usePlatformLeafSyntheticEventHandler({
    fn: wrappedSynthetic,
    action: 'activated',
    componentName: 'my-button',
    packageName: '@atlaskit/my-button',
    packageVersion: '1.0.0',
    analyticsData: {
      style: 'fancy'
    },
  });

  return (
    <button onClick={handler} onFocus={syntheticHandler}>Track me</button>
  );
}

export MyButton;
`;

export default function UsageWithPresentationalComponents(): React.JSX.Element {
	return (
		<div>
			<p>
				This section will guide how to add analytics tracking to presentational and other components
				that don&apos;t fit into the &quot;Container&quot; category.
			</p>
			<p>
				For a conceptual overview of <code>@atlaskit/analytics-next</code>, please consult the{' '}
				<a href="./concepts">concepts page</a>.
			</p>
			<p>
				There are several ways to add analytics to a component, via React hooks, or via higher order
				components (HOCs) - consult the Recommended Usage table for our suggested approach.
			</p>
			<h2>API</h2>
			<h3>Hooks API</h3>
			<ul>
				<li>
					<a href="#use-analytics-events">
						<code>useAnalyticsEvents</code>
					</a>
				</li>
				<li>
					<a href="#use-callback-with-analytics">
						<code>useCallbackWithAnalytics</code>
					</a>
				</li>
				<li>
					<a href="#use-platform-leaf-event-handlers">
						<code>usePlatformLeafEventHandler</code> and{' '}
						<code>usePlatformLeafSyntheticEventHandler</code>
					</a>
				</li>
			</ul>
			<h3>HOCs API</h3>
			<ul>
				<li>
					<a href="#with-analytics-events">
						<code>withAnalyticsEvents</code>
					</a>
				</li>
			</ul>
			<h3>Recommended Usage</h3>
			<table>
				<tbody>
					<tr>
						<th>Component Type</th>
						<th>Recommendation</th>
					</tr>
					<tr>
						<td>Class components</td>
						<td>
							You have only the <a href="#with-analytics-events">HOC option</a>
						</td>
					</tr>
					<tr>
						<td>Atlaskit function components</td>
						<td>
							Use{' '}
							<a href="#use-platform-leaf-event-handlers">
								<code>usePlatformLeafEventHandler</code>
							</a>
							.
						</td>
					</tr>
					<tr>
						<td>Other function components</td>
						<td>
							Use{' '}
							<a href="#use-callback-with-analytics">
								<code>useCallbackWithAnalytics</code>
							</a>{' '}
							if you want something basic.
							<br />
							Use{' '}
							<a href="#use-analytics-events">
								<code>useAnalyticsEvents</code>
							</a>{' '}
							if you want more control.
						</td>
					</tr>
				</tbody>
			</table>

			<h3>Examples</h3>
			<h4 id="use-analytics-events">
				The <code>useAnalyticsEvents</code> hook
			</h4>
			<p>
				This custom React hook provides a method <code>createAnalyticsEvent</code> for creating{' '}
				<code>UIAnalyticsEvent</code>s.
			</p>
			<CodeBlock code={useAnalyticsEventsCode} />
			<h4 id="use-callback-with-analytics">
				The <code>useCallbackWithAnalytics</code> hook
			</h4>
			<p>
				This custom React hook takes a callback function and an event payload, and channel, and
				returns a callback to fire the event and call the provided function.
			</p>
			<p>The hooks stores the input and memoizes the return value to optimize performance.</p>
			<CodeBlock code={useCallbackWithAnalyticsCode} />
			<h4 id="with-analytics-events">
				The <code>withAnalyticsEvents</code> HOC
			</h4>
			<p>
				A HOC which provides the wrapped component with a method for creating{' '}
				<code>UIAnalyticsEvent</code>s, via <code>props.createAnalyticsEvent</code>.
			</p>
			<p>The HOC supports a few ways to use it for convinvience.</p>
			<p>
				The first is to use the <code>createAnalyticsEvent</code> prop the HOC passes to the
				component manually:
			</p>
			<CodeBlock code={hocManualCode} />
			<p>
				Altenatively, the HOC accepts an optional map as its first argument, which provides a
				shortcut for passing a new analytics event as an additional parameter to the corresponding
				callback prop.
			</p>
			<CodeBlock code={hocMappedCode} />
			<p>
				Since creating and returning an event is such a common pattern an even more concise
				shorthand is supported:
			</p>
			<CodeBlock code={hocShorthandCode} />
			<h4 id="use-platform-leaf-event-handlers">
				The <code>usePlatformLeafEventHandler</code> and{' '}
				<code>usePlatformLeafSyntheticEventHandler</code> hooks
			</h4>
			<p>These hooks were built with internal leaf node components purely in mind.</p>
			<p>
				They dispatch an event on the <code>atlaskit</code> channel, then pass it to the wrapped
				function as the last argument in case you want to something additional with the event.
			</p>
			<p>
				<code>usePlatformLeafEventHandler</code> takes a function with two arguments (
				<code>value</code> and <code>analyticsEvent</code>), while{' '}
				<code>usePlatformLeafSyntheticEventHandler</code> takes a function with just one argument
				for the <code>analyticsEvent</code>.
			</p>
			<p>
				<strong>WARNING:</strong>{' '}
				<em>
					These hooks make an assumption that the component being wrapped is a &quot;leaf-node&quot;
					component, i.e., they have no children that require analytics themselves. This is so it
					can include the component name, package name, and package version as context in the
					analytics event. It assumes no children need this context and makes no attempt to pass it
					to them. This gains us a decent performance optimization. Use the other hooks if you are
					unsure you can use these safely.
				</em>
			</p>
			<CodeBlock code={leafHandlersCode} />
		</div>
	);
}
