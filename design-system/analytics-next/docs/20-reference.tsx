import React from 'react';
import { code, md, Props } from '@atlaskit/docs';

export default md`

  This section provides further detail on each component in this analytics package.

  * [UIAnalyticsEvent](#UIAnalyticsEvent)
  * [withAnalyticsEvents](#withAnalyticsEvents)
  * [AnalyticsListener](#AnalyticsListener)
  * [AnalyticsErrorBoundary](#AnalyticsErrorBoundary)
  * [AnalyticsContext](#AnalyticsContext)
  * [withAnalyticsContext](#withAnalyticsContext)
  * [AnalyticsEvent](#AnalyticsEvent)
  * [createAndFireEvent](#createAndFireEvent)
  * [useAnalyticsEvents](#useAnalyticsEvents)
  * [useCallbackWithAnalytics](#useCallbackWithAnalytics)


  <a name="UIAnalyticsEvent"></a>
  ### UIAnalyticsEvent

  &nbsp;

  The class used to represent an analytics event triggered by a user interaction. It has the following interface:

${code`
/** An array of objects containing data provided by any AnalyticsContext
 * components in the tree above where this event was created. */
context: Array<{}>;

/** An array of functions provided by any AnalyticsListener components in the
 * tree above where this event was created. */
handlers: Array<(event: UIAnalyticsEvent, channel?: string) => void>;

/** An object containing an action field and other arbitrary data. Can be
 * modified via the .update() method. */
payload: {
  action: string,
  [string]: any
};

/** Create a new event with the same context, handlers and payload as this
 * event. */
clone(): UIAnalyticsEvent | null;

/** Fire this event on the given channel. Listeners on this channel will be
 * called. */
fire(channel?: string): void;

/** Modify this event's payload. Accepts either a function, which will be passed
 * the current payload and must return a new payload, or an object, which will
 * be shallow merged into the current payload. */
update(
  updater: | { [string]: any }
  | ((payload: { action: string, [string]: any }) => {
      action: string,
      [string]: any,
    }),
) => UIAnalyticsEvent;
`}

  <a name="withAnalyticsEvents"></a>
  ### withAnalyticsEvents

  &nbsp;

  ${code`import { withAnalyticsEvents } from '@atlaskit/analytics-next';`}

  A HOC which provides the wrapped component with a method for creating \`UIAnalyticsEvent\`s, via \`props.createAnalyticsEvent\`.
  See the section on [creating your own events](/packages/core/analytics-next/docs/concepts#creating-your-own-events)
  in the Concepts page for a thorough explanation of how to use this component.

  Usage:

  ${code`withAnalyticsEvents()(Button);`}

  It accepts an optional map as its first argument, which provides a shortcut for passing a new analytics event as an additional parameter to the corresponding callback prop.

  Here's how that might look:

${code`
  withAnalyticsEvents({
    onChange: (createAnalyticsEvent, props) => {
      return createAnalyticsEvent({ action: 'change', checked: !props.checked });
    }
  })(Checkbox);
`}

  Whenever the wrapped component would fire a prop callback (in this case \`onChange\`), the corresponding function will be run first. It is provided with a function for creating an analytics event, as well as the component's props, and it should return a new analytics event. This event will automatically be added as an additional argument to the prop callback.

  Since creating and returning an event is such a common pattern an even more concise shorthand is supported:

${code`
  withAnalyticsEvents({
    onClick: { action: 'click' }
  })(Button)
`}

  You can simply provide a payload object and an event will be created automatically.


  <a name="AnalyticsListener"></a>
  ### AnalyticsListener

  &nbsp;

  ${code`import { AnalyticsListener } from '@atlaskit/analytics-next';`}

  An \`AnalyticsListener\` wraps your app and listens to any events which are fired within it.

  ${(
    <Props
      heading="AnalyticsListener Props"
      props={require('!!extract-react-types-loader!../src/AnalyticsListener')}
    />
  )}


  <a name="AnalyticsErrorBoundary"></a>
  ### AnalyticsErrorBoundary

  &nbsp;

  ${code`import { AnalyticsErrorBoundary } from '@atlaskit/analytics-next';`}

  Wrap part of your tree in \`AnalyticsErrorBoundary\` to provide error boundary track to any events created beneath it.

  When a component is created verifies all of the components above it in the tree and any error will be catched and tracked automatically.

  It's up to the developer pass this information when you're adding the component.

  Usage:

${code`
import {
  AnalyticsListener,
  AnalyticsErrorBoundary
} from '@atlaskit/analytics-next';

// Wrapping your component with the component
class ButtonWithAnalyticsErrorBoundary extends React.Component {
  handleEvent = (analyticsEvent) => {
    const { payload, context } = analyticsEvent;
    console.log('Received event:', analyticsEvent, { payload, context });
  };

  render() {
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
        <AnalyticsErrorBoundary
          channel="atlaskit"
          data={{
            componentName: 'button',
            packageName: '@atlaskit/button',
            componentVersion: '999.9.9',
          }}
        >
          <Button>Click me</Button>
        </AnalyticsErrorBoundary>
      </AnalyticsListener>
    )
  }
}
`}

  ${(
    <Props
      heading="AnalyticsErrorBoundary Props"
      props={require('!!extract-react-types-loader!../src/AnalyticsErrorBoundary')}
    />
  )}


  <a name="AnalyticsContext"></a>
  ### AnalyticsContext

  &nbsp;

  ${code`import { AnalyticsContext } from '@atlaskit/analytics-next';`}

  Wrap part of your tree in \`AnalyticsContext\` to provide data to any events created beneath it. When an event is created it snapshots all of the \`AnalyticsContext\`s above it in the tree and creates an array from the data. It's up to you to parse this information when you handle the event.

  ${(
    <Props
      heading="AnalyticsContext Props"
      props={require('!!extract-react-types-loader!../src/AnalyticsContext')}
    />
  )}

  <a name="withAnalyticsContext"></a>
  ### withAnalyticsContext

  &nbsp;

  ${code`import { withAnalyticsContext } from '@atlaskit/analytics-next';`}

  This HOC wraps a component in an \`AnalyticsContext\` and allows you to provide a default \`data\` value for it.

  Usage:

${code`
const ButtonWithContext = withAnalyticsContext({
  // Default context data
  component: 'button',
})(Button);

/* ... */

const Form = (props) => (
  <div>
    <Field />
    <ButtonWith Context
      // The consumer can overwrite the default context data
      analyticsContext={{ component: 'submit-button' }}
      {...props}
    >
      Submit
    </ButtonWithContext>
  </div>
);
`}

  Note: if a consumer provides a value for \`analyticsContext\` it is shallow merged with the default data.

  <a name="AnalyticsEvent"></a>
  ### AnalyticsEvent

  &nbsp;

  ${code`import { AnalyticsEvent } from '@atlaskit/analytics-next';`}

  A more generic type of event which only contains a payload and an update method. If you want to create an event outside of the UI you can create an instance of this class directly. Please see [UIAnalyticsEvent](#UIAnalyticsEvent) for more information.

  <a name="createAndFireEvent"></a>
  ### createAndFireEvent

  &nbsp;

  ${code`import { createAndFireEvent } from '@atlaskit/analytics-next';`}

  A helper to make firing an analytics event on different channels easier.

  Usage:

${code`
const ButtonWithAnalytics = withAnalyticsEvents({
  onClick: createAndFireEvent('atlaskit')({ action: 'click' }),
})(Button);
`}

This will create an event with the payload, fire it on the \`'atlaskit'\`
channel and return a clone of the event.

<a name="useAnalyticsEvents"></a>
### useAnalyticsEvents

This custom React hook provides a method \`createAnalyticsEvent\` for creating \`UIAnalyticsEvent\`s. This hook can be used as a replacement for the \`withAnalyticsEvents\` HOC. See the section on [creating your own events](/packages/core/analytics-next/docs/concepts#creating-your-own-events)
in the Concepts page for a thorough explanation of how to use this hook.

Usage:

${code`
const { createAnalyticsEvent } = useAnalyticsEvents();

const onClick = event => {
  createAnalyticsEvent({
    // payload
  }).fire();

  // onClick logic
}
`}

<a name="useCallbackWithAnalytics"></a>
### useCallbackWithAnalytics

This custom React hook takes a callback function and an event payload, and returns a callback to fire the event and call the provided function. The hooks stores the input and memoizes the return value to optimize performance.

Usage:

${code`
const handleClick = useCallbackWithAnalytics(
  event => {
    // onClick logic
  }, {
    action: 'click',
  }
);

return <Button onClick={handleClick}>Click Me<Button>
`}

`;
