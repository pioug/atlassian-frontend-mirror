import { md } from '@atlaskit/docs';

export default md`
  # Analytics GAS types

  The main purpose of this component is to provide types to be used when firing analytic events that should have a GAS V3 shape through analytics-next API.

  ## Installation

  ~~~js
  npm install @atlaskit/analitics-gas-types
  # or
  yarn add  @atlaskit/analitics-gas-types
  ~~~

  ## Using the component

  Example using the GasPayload type when firing an analytics-next event:

  ~~~js
  import React from 'react';
  import { withAnalyticsEvents } from '@atlaskit/analytics-next';

  import { GasPayload } from '@atlaskit/analytics-gas-types';

  export type Props = {
    onClick: e => void,
  };

  export const DummyComponent: React.StatelessComponent<Props> = (
    props: Props,
  ) => (
    <div id="dummy" onClick={props.onClick}>
      Test
    </div>
  );
  DummyComponent.displayName = 'DummyComponent';

  export const DummyComponentWithAnalytics = withAnalyticsEvents({
    onClick: (createEvent, props) => {
      const event: GasPayload = {
        action: 'someAction',
        actionSubject: 'someComponent',
        eventType: 'ui',
        source: 'unknown',
      };
      createEvent(event).fire('fabric-elements');
    },
  })(DummyComponent);
  ~~~
`;
