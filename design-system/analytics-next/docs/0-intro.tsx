import React from 'react';
import { code, md } from '@atlaskit/docs';
import {
  instrumentedComponents,
  InstrumentedItem,
} from '../src/AnalyticsEventMap';

const scrubRepeatedInfo = (
  item: InstrumentedItem,
  i: number,
  items: InstrumentedItem[],
) => {
  const prev = i > 0 ? items[i - 1] : undefined;

  return {
    ...item,
    packageName:
      prev && item.packageName !== prev.packageName ? item.packageName : '',
    component: prev && item.component !== prev.component ? item.component : '',
    actionSubject:
      prev && item.actionSubject !== prev.actionSubject
        ? item.actionSubject
        : '',
    key: `${item.packageName}-${item.component}-${item.prop}`,
  };
};

const InstrumentedTable = ({ packages }: { packages: InstrumentedItem[] }) => (
  <table>
    <thead>
      <tr>
        <th>Package</th>
        <th>Component</th>
        <th>Action Subject</th>
        <th>Prop</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {packages
        .map(scrubRepeatedInfo)
        .map(
          ({ key, packageName, actionSubject, component, prop, payload }) => (
            <tr key={key}>
              <td>{packageName}</td>
              <td>{component}</td>
              <td>{actionSubject}</td>
              <td>{prop}</td>
              <td>{payload.action}</td>
            </tr>
          ),
        )}
    </tbody>
  </table>
);

export default md`
Many of our components support analytics out of the box. These components create
analytics events and hand them to you. This puts you in control of firing, listening
and recording these events in which ever way you like.
  ## Usage

  Let's look at a simple component to understand how to use Button's click analytics.

  ### SaveButton.js
${code`
import Button from '@atlaskit/button';

const SaveButton = ({ onClick }) => (
  <Button onClick={onClick}>Save</Button>
);
`}

  Button provides you a [UIAnalyticsEvent](/packages/core/analytics-next/docs/reference#UIAnalyticsEvent) as the last arg
  to the onClick hander. This is the pattern used for all callback props that
  support analytics.

  Now you have the event, it is up to you to fire it.

  ### SaveButton.js
${code`
import Button from '@atlaskit/button';

const SaveButton = ({ onClick }) => (
  <Button
    onClick={(e, analyticsEvent) => {
      analyticsEvent.fire();
      if (onClick) {
        onClick(e);
      }
    }}
  >
    Save
  </Button>
);
`}

  This is a good opportunity to add more information to the analytics event before firing.

  The next step is to set up a listener which receives the events.

  ### App.js
${code`
import { AnalyticsListener } from '@atlaskit/analytics-next';
import SaveButton from './SaveButton';

const sendAnalytics = analytic => console.log(analytic);

const App = () => (
  <AnalyticsListener onEvent={sendAnalytics}>
    <SaveButton />
  </AnalyticsListener>,
);
`}

  The \`onEvent\` handler will be called every time an analytics event is fired.
  This where you can record the event by sending information to a backend service.

  That's it! Below are some links to handy resources.

  * [More information on UIAnalyticsEvent](/packages/core/analytics-next/docs/reference#UIAnalyticsEvent)
  * [The list of instrumented components](#InstrumentedComponents)
  * [Adding extra information to an analytics event](/packages/core/analytics-next/docs/concepts#adding-more-information-to-an-event)
  * [Analytics component reference](/packages/core/analytics-next/docs/reference)

  <a name="InstrumentedComponents"></a>
  ## Instrumented Components

  This table shows all the component interactions that are instrumented. All events
  additionally include \`packageName\` and \`packageVersion\` in their payloads.

  ${(<InstrumentedTable packages={instrumentedComponents} />)}

`;
