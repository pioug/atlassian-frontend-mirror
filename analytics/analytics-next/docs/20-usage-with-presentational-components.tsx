import React from 'react';

import { code, md } from '@atlaskit/docs';

export default md`
This section will guide how to add analytics tracking to presentational and other
components that don't fit into the "Container" category.

For a conceptual overview of \`@atlaskit/analytics-next\`, please consult the
[concepts page](./concepts).

There are several ways to add analytics to a component, via React hooks, or
via higher order components (HOCs) - consult the Recommended Usage table for
our suggested approach.

## API

### Hooks API

* [\`usePlatformLeafEventHandler\`](#use-platform-leaf-event-handler)
* [\`useAnalyticsEvents\`](#use-analytics-events)
* [\`useCallbackWithAnalytics\`](#use-callback-with-analytics)

### HOCs API

* [\`withAnalyticsEvents\`](#with-analytics-events)

### Recommended Usage

${(
  <table>
    <tr>
      <th>Component Type</th>
      <th>Recommendation</th>
    </tr>
    <tr>
      <td>Class components</td>
      <td>
        You have only the <a href="#with-analytics-events">HOC option</a>{' '}
        available.
      </td>
    </tr>
    <tr>
      <td>Atlaskit function components</td>
      <td>
        Use{' '}
        <a href="#use-platform-leaf-event-handler">
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
  </table>
)}

### Examples

<a name="use-platform-leaf-event-handler"></a>
#### The \`usePlatformLeafEventHandler\` hook

This hook was built with Atlaskit components purely in mind.

It dispatches an event on the \`atlaskit\` channel then passes it to the
wrapped function as the last argument in case you want to something additional with the event.

&nbsp;

**WARNING:** *This hook makes an assumption that the component being wrapped is a "leaf-node"
component, i.e., they have no children that require analytics themselves. This
is so it can include the component name, package name, and package version as context
in the analytics event. It assumes no children need this context and makes no attempt to
pass it to them. This gains us a decent performance optimization. Use the other hooks
if you are unsure you can use this safely.*

&nbsp;

${code`
import React, { useCallback } from 'react';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';

const MyButton = ({ onClick = () => {} }) => {
  // this isn't necessary if you are happy with just firing on the 'alaskit' channel
  const wrapped = (clickEvent, analyticsEvent) => {
    // do what you like with the event, fire / modify / clone
    // this here is the typical usage pattern for atlaskit components

    const clonedEvent = analyticsEvent.clone();

    analyticsEvent.fire("otherChannel");

    // firing is prevented from happening more than once
    // so that's why we pass a clone to be accessed by the parent component
    // which might also want to fire their own event on this ui interaction
    onClick(clickEvent, clonedEvent);
  };

  const handler = usePlatformLeafEventHandler({
    fn: wrapped, // use onClick instead if you want to just fire on 'atlaskit'
    action: 'clicked',
    componentName: 'my-button',
    packageName: '@atlaskit/my-button',
    packageVersion: '1.0.0',
    analyticsData: {
      // any additional data can live here
      style: 'fancy'
    },
  });

  return (
    <button onClick={handler}>Track me</button>
  );
}

export MyButton;
`}


<a name="use-analytics-events"></a>
#### The \`useAnalyticsEvents\` hook

This custom React hook provides a method \`createAnalyticsEvent\` for creating \`UIAnalyticsEvent\`s.

${code`
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

    // do what you like with the event, fire / modify / clone
    // this here is the typical usage pattern for atlaskit components

    const clonedEvent = analyticsEvent.clone();

    analyticsEvent.fire("atlaskit");

    // firing is prevented from happening more than once
    // so that's why we pass a clone to be accessed by the parent component
    // which might also want to fire their own event on this ui interaction
    onClick(clickEvent, clonedEvent);
  }, [ createAnalyticsEvent, onClick ]);

  return (
    <button onClick={handler}>Track me</button>
  );
}

export MyButton;
`}

<a name="use-callback-with-analytics"></a>
#### The \`useCallbackWithAnalytics\` hook

This custom React hook takes a callback function and an event payload, and channel, and
returns a callback to fire the event and call the provided function.

The hooks stores the input and memoizes the return value to optimize performance.

${code`
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
`}

<a name="with-analytics-events"></a>
#### The \`withAnalyticsEvents\` HOC

A HOC which provides the wrapped component with a method for creating \`UIAnalyticsEvent\`s,
via \`props.createAnalyticsEvent\`.

The HOC supports a few ways to use it for convinvience.

The first is to use the \`createAnalyticsEvent\` prop the HOC passes to the component manually:

${code`
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

const MyButton = ({ onClick = () => {}, createAnalyticsEvent }) => {
  const handler = (clickEvent) => {
    const analyticsEvent = createAnalyticsEvent({
      action: 'clicked',
      componentName: 'my-button',
      packageName: '@atlaskit/my-button',
      packageVersion: '1.0.0'
    });

    // do what you like with the event, fire / modify / clone
    // this here is the typical usage pattern for atlaskit components

    const clonedEvent = analyticsEvent.clone();

    analyticsEvent.fire("atlaskit");

    // firing is prevented from happening more than once
    // so that's why we pass a clone to be accessed by the parent component
    // which might also want to fire their own event on this ui interaction
    onClick(clickEvent, clonedEvent);
  };

  return (
    <button onClick={handler}>Track me</button>
  );
}

const AnalyticsWrappedButton = withAnalyticsEvents()(MyButton);

export AnalyticsWrappedButton;
`}

&nbsp;

Altenatively, the HOC accepts an optional map as its first argument, which provides a shortcut
for passing a new analytics event as an additional parameter to the corresponding callback prop.

${code`
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

const MyButton = ({ onClick = () => {} }) => {
  const handler = (clickEvent, analyticsEvent) => {
    // do what you like with the event, fire / modify / clone
    // this here is the typical usage pattern for atlaskit components

    const clonedEvent = analyticsEvent.clone();

    analyticsEvent.fire("atlaskit");

    // firing is prevented from happening more than once
    // so that's why we pass a clone to be accessed by the parent component
    // which might also want to fire their own event on this ui interaction
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
`}

&nbsp;

Since creating and returning an event is such a common pattern an even more concise shorthand is supported:

${code`
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

const MyButton = ({ onClick = () => {} }) => {
  const handler = (clickEvent, analyticsEvent) => {
    // do what you like with the event, fire / modify / clone
    // this here is the typical usage pattern for atlaskit components

    const clonedEvent = analyticsEvent.clone();

    analyticsEvent.fire("atlaskit");

    // firing is prevented from happening more than once
    // so that's why we pass a clone to be accessed by the parent component
    // which might also want to fire their own event on this ui interaction
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
`}
`;
