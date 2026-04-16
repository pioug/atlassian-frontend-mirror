/* eslint-disable @atlaskit/design-system/use-primitives-text, @atlaskit/design-system/use-heading, @atlaskit/design-system/no-html-anchor -- Legacy analytics-next docs intentionally use plain HTML prose and links instead of ADS docs primitives. */
import React from 'react';

import { CodeBlock } from './DocBlocks';

const exampleCode = `
// ---- CONSUMER COMPONENT LAYER ----

// We want to add tracking for the 'click' of this button
const TargetButton = ({ onClick }) => {
  // this analytics event is given to the callback via the
  // HOC wrapping of this component below
  const handler = (clickEvent, analyticsEvent) => {
    analyticsEvent.fire("myTargetChannel");
  };

  return <button onClick={handler}>Track me</button>
}

// Analytics can be baked into your target components
// in a number of ways, this is just one of many!
const AnalyticsWrappedButton = withAnalyticsEvent({
  onClick: {
    component: 'button',
    action: 'clicked'
  }
})(TargetButton);

// ---- ANALYTICS CONTEXT LAYER ----

// Our target button is going to be used inside of a form
const FormContainer = ({ children }) => {
  return (
    <form>
      {children}
    </form>
  );
}

// This wrapper gives the container a way of passing to its children
// components some context about where it is consumed.
// Again there are a few ways of doing this!
const AnalyticsWrappedForm = withAnayticsContext({
  container: 'submissionForm',
  page: '/invite-a-friend'
})(FormContainer);

// ---- ANALYTICS LISTENER LAYER ----

// This is our App's listener
// Note: It is possible to have multiple listeners, all listening
// on different channels, allowing for different handlers for different
// kind of events
const OurAnalyticsListener = ({ children }) => {
  const onEvent = (event, channel) => {
    // these components are agnostic to what you want to use
    // to send events to the network
    someClient.sendToNetwork(event);

    expect(event.payload).toBe({
      action: 'clicked'
      component: 'button'
    });

    // an array of contexts (multiple context containers can be nested)
    expect(event.context).toBe([{
      container: 'submissionForm',
      page: '/invite-a-friend'
    });
  };

  return (
    <AnalyticsListener channel="myTargetChannel" onEvent={onEvent}>
      {children}
    </AnalyticsListener>
  )
}

// ---- ALL TOGETHER ----

export const ExampleApp = () => {
  return (
    <OurAnalyticsListener>
      <AnalyticsWrappedForm>
        <AnalyticsWrappedButton/>
      </AnalyticsWrappedForm>
    </OurAnalyticsListener>);
};
`;

export default function Concepts(): React.JSX.Element {
	return (
		<div>
			<p>
				There are 3 abstract layers as part of <code>@atlaskit/analytics-next</code>:
			</p>
			<ul>
				<li>
					<a href="./listeners">Analytics Listeners</a> (responsible for sending events over the
					network)
				</li>
				<li>
					<a href="./usage-with-presentational-components">Consumer Components</a> (target
					components that are desired to be tracked. They fire events that the listener consumes)
				</li>
				<li>
					<a href="./usage-for-container-components">Analytics Contexts</a> (provides contextual
					data to consumer components about where it is embeded in the &quot;container&quot; they
					are embeded in. This data is added to the event fired by all consumer components that are
					its children.)
				</li>
			</ul>

			<h3>React Context: !important;</h3>
			<p>
				These layers communicate via React context. Historically this package has used{' '}
				<a href="https://reactjs.org/docs/legacy-context.html">legacy React Context</a>, but is now
				transitioning to use only the new{' '}
				<a href="https://reactjs.org/docs/context.html">React Context API</a>. This is to prepare
				for future versions of React in which legacy Context will be dropped, but also partially for
				performance reasons.
			</p>
			<p>To achieve dropping legacy context we are rolling the drop out in 2 phases:</p>
			<h4>Phase I (version 7.1.0)</h4>
			<p>
				Analytics consuming components receive only modern context. Listeners and the Context layer
				will provide both modern and legacy context by default.
			</p>
			<p>
				At their own risk, package consumers can opt in to no longer supply legacy context by using
				the environment variable ANALYTICS_NEXT_MODERN_CONTEXT=true.
			</p>
			<p>
				When doing so, any analytics consumers that rely on legacy context will not receive any, and
				events may be lost! This would happen when using old atlaskit packages that consume a
				version of @atlaskit/analytics-next before version 7.1.0.
			</p>
			<h4>Phase II (future major)</h4>
			<p>
				In a future release (TBA) we will remove all legacy context support and clean up the
				branching around ANALYTICS_NEXT_MODERN_CONTEXT. After this point, @atlaskit/analytics-next
				will not work with components that use a version prior to 7.1.0.
			</p>
			<h3>Example</h3>
			<CodeBlock code={exampleCode} />
		</div>
	);
}
