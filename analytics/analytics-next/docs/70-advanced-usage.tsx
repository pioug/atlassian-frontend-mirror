/* eslint-disable @atlaskit/design-system/use-primitives-text, @atlaskit/design-system/use-heading, @atlaskit/design-system/no-html-anchor -- Legacy analytics-next docs intentionally use plain HTML prose and hash links instead of ADS docs primitives. */
import React from 'react';

import { CodeBlock, ExampleBlock } from './DocBlocks';

const saveButtonCode = `
import Button from '@atlaskit/button';

const SaveButton = ({ onClick }) => (
  <Button
    onClick={(e, analytic) => {
      analytic
        .update({ timestamp: Date.now() })
        .fire();
      if (onClick) {
        onClick(e);
      }
    }}
  >
    Save
  </Button>
);
`;

const usingChannelCode = `
handleClick = e => {
  const analyticsEvent = this.props.createAnalyticsEvent({ action: 'click' });
  analyticsEvent.fire('atlaskit');

  if (this.props.onClick) {
    this.props.onClick(e);
  }
};
`;

const appRenderCode = `
render() {
  return (
    <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
      <Button>Click me</Button>
    </AnalyticsListener>
  );
}
`;

const passingEventCode = `
handleClick = e => {
  const analyticsEvent = this.props.createAnalyticsEvent({ action: 'click' });

  if (this.props.onClick) {
    this.props.onClick(e, analyticsEvent);
  }
};
`;

const shortcutCode = `
const ButtonWithAnalytics = withAnalyticsEvents({
  onClick: { action: 'click' }
})(Button);
`;

const propsFunctionCode = `
const ButtonWithAnalytics = withAnalyticsEvents({
  onClick: (createEvent, props) => {
    return createEvent({ action: 'click', appearance: props.appearance });
  },
})(Button);
`;

const cloningCode = `
onSubmit = analyticsEvent => {
  const { value } = this.state;
  const publicEvent = analyticsEvent.clone();
  analyticsEvent.update({ value }).fire('atlaskit');

  if (this.props.onSubmit) {
    this.props.onSubmit(value, publicEvent);
  }
};
`;

const cloningShortcutCode = `
import { withAnalyticsEvents, createAndFireEvent } from '@atlaskit/analytics-next';

const FormWithAnalytics = withAnalyticsEvents({
  onSubmit: createAndFireEvent('atlaskit')({ action: 'submit' })
})(Form);
`;

const outsideUiCode = `
import { AnalyticsEvent } from '@atlaskit/analytics-next';
import sendAnalyticsEventToBackend from './sendAnalyticsEventToBackend';

const fetchBacon = async () => {
  const startTime = performance.now();

  const data = (await (await fetch(
    'https://baconipsum.com/api/?type=meat-and-filler',
  )).json())[0];

  const responseTime = performance.now() - startTime;

  const analyticsEvent = new AnalyticsEvent({
    payload: { action: 'server-request', data, responseTime },
  });

  sendAnalyticsEventToBackend(analyticsEvent);

  return data;
};
`;

export default function AdvancedUsage(): React.JSX.Element {
	return (
		<div>
			<h3>Contents</h3>
			<ul>
				<li>
					<a href="#adding-more-information-to-an-event">Adding more information to an event</a>
				</li>
				<li>
					<a href="#using-a-channel">Using a channel</a>
				</li>
				<li>
					<a href="#passing-an-event-to-your-consumers">Passing an event to your consumers</a>
				</li>
				<li>
					<a href="#cloning-an-event">Cloning an event</a>
				</li>
				<li>
					<a href="#tracking-events-outside-the-ui">Tracking events outside the UI</a>
				</li>
			</ul>

			<h2 id="adding-more-information-to-an-event">Adding more information to an event</h2>
			<p>
				This package provides two methods for adding extra information to analytics events. The
				first method is by adding data to the analytics events payload. The second method is to
				provide contextual information to any event.
			</p>
			<h3>Adding data to an event&apos;s payload</h3>
			<p>
				Before firing an analytics event, you can add data the payload by using the{' '}
				<code>update</code> method. Here&apos;s an example of how that looks:
			</p>
			<h5>SaveButton.js</h5>
			<CodeBlock code={saveButtonCode} />
			<p>
				In addition to accepting an object, the <code>update</code> method accepts a function which
				is called with the event&apos;s current payload and is expected to return a new payload.
			</p>
			<p>
				Below is a fleshed out example demonstrating how to add extra information to the
				event&apos;s payload.
			</p>
			<ExampleBlock
				Component={require('../examples/40-updating-an-event').default}
				title="Updating an event's payload"
				source={require('!!raw-loader!../examples/40-updating-an-event')}
			/>

			<h2 id="using-a-channel">Using a channel</h2>
			<p>The feature is likey more useful for component authors.</p>
			<p>
				When calling <code>fire</code> on an analytics event, you can optionally specify a channel
				to fire the event on. Only listeners on that channel will recieve the event.
			</p>
			<h5>Button.js (handleClick method)</h5>
			<CodeBlock code={usingChannelCode} />
			<p>
				In the above example, we fire events on the <code>&apos;atlaskit&apos;</code> channel. To
				listen on this channel we would set up our App like:
			</p>
			<h5>App.js (render method)</h5>
			<CodeBlock code={appRenderCode} />
			<p>
				The <code>AnalyticsListener</code> component accepts <code>channel</code> and{' '}
				<code>onEvent</code> props. When an event is fired on this Listener&apos;s channel its
				onEvent function will be called.
			</p>

			<h2 id="passing-an-event-to-your-consumers">Passing an event to your consumers</h2>
			<p>
				The features described in this section are likey to be more useful to component authors.
			</p>
			<p>
				If you are building components, you might not want to fire an event as soon as it&apos;s
				created - instead it is better to provide the event to the consumer of your component. The
				consumer then has a chance to add more information and fire the event when they&apos;re
				ready.
			</p>
			<p>
				This is exactly the approach we took to instrument our own Atlaskit components. This section
				will show you how we did it and how to use the same approach in your components.
			</p>
			<p>
				The most straight forward way is to pass the event as an extra argument to the corresponding
				callback prop. Here&apos;s our updated Button component:
			</p>
			<h5>Button.js (handleClick method)</h5>
			<CodeBlock code={passingEventCode} />
			<p>
				This is a pretty common pattern for component authors, so <code>withAnalyticsEvents</code>{' '}
				provides a shortcut:
			</p>
			<h5>Button.js</h5>
			<CodeBlock code={shortcutCode} />
			<p>
				<code>withAnalyticsEvents</code> accepts an optional object mapping callback prop names to
				payloads. This event will be automatically added as a final argument to the callback prop.
				If the analytics event payload needs to include some information from the components props,{' '}
				<code>withAnalyticsEvents</code> also accepts a function.
			</p>
			<h5>Button.js</h5>
			<CodeBlock code={propsFunctionCode} />
			<ExampleBlock
				Component={require('../examples/30-passing-events-to-a-callback').default}
				title="Passing events through callbacks"
				source={require('!!raw-loader!../examples/30-passing-events-to-a-callback')}
			/>

			<h2 id="cloning-an-event">Cloning an event</h2>
			<p>
				The features described in this section are likey to be more useful to component authors.
			</p>
			<p>
				Once an event has been fired it cannot be updated or fired again. This poses a problem for
				library component authors who want to record their own analytics events, while also exposing
				analytics events to their consumers.
			</p>
			<p>
				That&apos;s where <code>.clone</code> comes in.
			</p>
			<p>
				Let&apos;s imagine a Form component. If it accepted an <code>onSubmit</code> callback prop
				we could do something like this:
			</p>
			<h5>Form.js (onSubmit method):</h5>
			<CodeBlock code={cloningCode} />
			<p>This is a common enough usecase that we have built a helper to make this easier to do.</p>
			<h5>Form.js (onSubmit method):</h5>
			<CodeBlock code={cloningShortcutCode} />
			<p>
				This will create the event with the payload, fire it on the specified channel and return a
				clone of the event.
			</p>
			<ExampleBlock
				Component={require('../examples/50-cloning-an-event').default}
				title="Cloning an event"
				source={require('!!raw-loader!../examples/50-cloning-an-event')}
			/>

			<h2 id="tracking-events-outside-the-ui">Tracking events outside the UI</h2>
			<p>
				This library provides tools for tracking interactions with UI components, and makes it
				really easy to capture the UI context and state when these events occur. But what if the
				event you&apos;re tracking doesn&apos;t care about the UI? Can you still use this library to
				track it?
			</p>
			<p>
				Well, sure - but you might not need to. An event has to be created by a UI component to get{' '}
				<code>context</code> and a <code>.fire</code> method. Without these properties an analytics
				event is basically a payload! It might be simpler to just create an object and pass it
				directly to the function that handles your events.
			</p>
			<p>
				In case it is useful for you to have a consistent interface for your events, even if
				they&apos;re not coming from the UI, we do export the base <code>AnalyticsEvent</code>{' '}
				class. Here&apos;s an example of how you might use it:
			</p>
			<CodeBlock code={outsideUiCode} />
		</div>
	);
}
