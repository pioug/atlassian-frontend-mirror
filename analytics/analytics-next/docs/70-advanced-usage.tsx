import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`
  ### Contents

  * [Adding more information to an event](#adding-more-information-to-an-event)
  * [Using a channel](#using-a-channel)
  * [Passing an event to your consumers](#passing-an-event-to-your-consumers)
  * [Cloning an event](#cloning-an-event)
  * [Tracking events outside the UI](#tracking-events-outside-the-ui)

  <a name="adding-more-information-to-an-event"></a>
  ## Adding more information to an event

  This package provides two methods for adding extra information to analytics events.
  The first method is by adding data to the analytics events payload. The second method
  is to provide contextual information to any event.

  <a name="adding-data-to-an-events-payload"></a>
  ### Adding data to an event's payload

  Before firing an analytics event, you can add data the payload by using the \`update\` method.
  Here's an example of how that looks:

  ##### SaveButton.js

${code`
import Button from '@atlaskit/button';

const SaveButton = ({ onClick }) => (
  <Button
    onClick={(e, analytic) => {
      // update will merge the value into the existing payload
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
`}

  In addition to accepting an object, the \`update\` method accepts a function which is called
  with the event's current payload and is expected to return a new payload.

  Below is a fleshed out example demonstrating how to add extra information to the event's payload.

  ${(
    <Example
      packageName="@atlaskit/analytics-next"
      Component={require('../examples/40-updating-an-event').default}
      title="Updating an event's payload"
      source={require('!!raw-loader!../examples/40-updating-an-event')}
    />
  )}

  <a name="using-a-channel"></a>
  ## Using a channel

  The feature is likey more useful for component authors.

  When calling \`fire\` on an analytics event, you can optionally specify a channel
  to fire the event on. Only listeners on that channel will recieve the event.

  ##### Button.js (handleClick method)

${code`
handleClick = e => {
  // Create our analytics event
  const analyticsEvent = this.props.createAnalyticsEvent({ action: 'click' });

  // Fire our analytics event on the 'atlaskit' channel
  analyticsEvent.fire('atlaskit');

  if (this.props.onClick) {
    this.props.onClick(e);
  }
};
`}

  In the above example, we fire events on the \`'atlaskit'\` channel. To listen
  on this channel we would set up our App like:

  ##### App.js (render method)

${code`
render() {
  return (
    <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
      <Button>Click me</Button>
    </AnalyticsListener>
  );
}
`}

  The \`AnalyticsListener\` component accepts \`channel\` and \`onEvent\` props. When an event is fired on this Listener's channel its onEvent function will be called.

  <a name="passing-an-event-to-your-consumers"></a>
  ## Passing an event to your consumers

  The features described in this section are likey to be more useful to component
  authors.

  If you are building components, you might not want to fire an event as
  soon as it's created - instead it is better to provide the event to the consumer
  of your component. The consumer then has a chance to add more information and fire
  the event when they're ready.

  This is exactly the approach we took to instrument our own Atlaskit components.
  This section will show you how we did it and how to use the same approach in
  your components.

  The most straight forward way is to pass the event as an extra argument to the
  corresponding callback prop. Here's our updated Button component:

  ##### Button.js (handleClick method)

${code`
handleClick = e => {
  // Create our analytics event
  const analyticsEvent = this.props.createAnalyticsEvent({ action: 'click' });

  if (this.props.onClick) {
    // Pass the event through the corresponding callback prop
    this.props.onClick(e, analyticsEvent);
  }
};
`}

  This is a pretty common pattern for component authors, so \`withAnalyticsEvents\`
  provides a shortcut:

  ##### Button.js

${code`
const ButtonWithAnalytics = withAnalyticsEvents({
  // simply provide a payload we'll automatically create an event for you
  onClick: { action: 'click' }
})(Button);
`}

  \`withAnalyticsEvents\` accepts an optional object mapping callback prop names to payloads.
  This event will be automatically added as a final argument to the callback prop.
  If the analytics event payload needs to include some information from the components
  props, \`withAnalyticsEvents\` also accepts a function.

  ##### Button.js

${code`
const ButtonWithAnalytics = withAnalyticsEvents({
  // this function should return an analytics event
  onClick: (createEvent, props) => {
    return createEvent({ action: 'click', appearance: props.appearance });
  },
})(Button);
`}

  ${(
    <Example
      packageName="@atlaskit/analytics-next"
      Component={require('../examples/30-passing-events-to-a-callback').default}
      title="Passing events through callbacks"
      source={require('!!raw-loader!../examples/30-passing-events-to-a-callback')}
    />
  )}

  <a name="cloning-an-event"></a>
  ## Cloning an event

  The features described in this section are likey to be more useful to component
  authors.

  Once an event has been fired it cannot be updated or fired again. This poses a
  problem for library component authors who want to record their own analytics
  events, while also exposing analytics events to their consumers.

  That's where \`.clone\` comes in.

  Let's imagine a Form component. If it accepted an \`onSubmit\` callback prop we could do something like this:

  ##### Form.js (onSubmit method):

${code`
onSubmit = analyticsEvent => {
  const { value } = this.state;

  // Clone the analytics event
  const publicEvent = analyticsEvent.clone();

  // Add whatever data we want to know about to our event and fire it
  analyticsEvent.update({ value }).fire('atlaskit');

  if (this.props.onSubmit) {
    // Pass the cloned event to the callback prop for consumers to use
    this.props.onSubmit(value, publicEvent);
  }
};
`}

  This is a common enough usecase that we have built a helper to make this
  easier to do.

  ##### Form.js (onSubmit method):

${code`
import { withAnalyticsEvents, createAndFireEvent } from '@atlaskit/analytics-next';

const FormWithAnalytics = withAnalyticsEvents({
  onSubmit: createAndFireEvent('atlaskit')({ action: 'submit' })
})(Form);
`}

  This will create the event with the payload, fire it on the specified channel
  and return a clone of the event.

  ${(
    <Example
      packageName="@atlaskit/analytics-next"
      Component={require('../examples/50-cloning-an-event').default}
      title="Cloning an event"
      source={require('!!raw-loader!../examples/50-cloning-an-event')}
    />
  )}

  <a name="tracking-events-outside-the-ui"></a>
  ## Tracking events outside the UI

  This library provides tools for tracking interactions with UI components, and makes it really easy to capture the UI context and state when these events occur. But what if the event you're tracking doesn't care about the UI? Can you still use this library to track it?

  Well, sure - but you might not need to. An event has to be created by a UI component to get \`context\` and a \`.fire\` method. Without these properties an analytics event is basically a payload! It might be simpler to just create an object and pass it directly to the function that handles your events.

  In case it is useful for you to have a consistent interface for your events, even if they're not coming from the UI, we do export the base \`AnalyticsEvent\` class. Here's an example of how you might use it:

${code`
import { AnalyticsEvent } from '@atlaskit/analytics-next';
import sendAnalyticsEventToBackend from './sendAnalyticsEventToBackend';

const fetchBacon = async () => {
  const startTime = performance.now();

  const data = (await (await fetch(
    'https://baconipsum.com/api/?type=meat-and-filler',
  )).json())[0];

  const responseTime = performance.now() - startTime;

  /** This event records server response time. This function doesn't live inside
   * a component and we don't care what state the UI is in when it runs. It
   * would be annoying if we had to create the event inside a component, then
   * pass it to this function. We can create a generic AnalyticsEvent and handle
   * it all inside this function instead. */
  const analyticsEvent = new AnalyticsEvent({
    payload: { action: 'server-request', data, responseTime },
  });

  /** Because we're not in the UI this event doesn't have any
   * AnalyticsListeners, which means it doesn't have a .fire method. We need to
   * explicitly pass it to the function that will handle it. */
  sendAnalyticsEventToBackend(analyticsEvent);

  return data;
};
`}
`;
