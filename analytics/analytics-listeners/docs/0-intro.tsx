import { md, code } from '@atlaskit/docs';

export default md`
  # Fabric aggregated listeners for analytics-next API

  The main purpose of this component is to provide a high level abstraction of all Fabric listeners used with analytics-next API so
  the Products can only import this component instead of having multiple nested listeners in their code.

  The following listeners are currently implemented:

  * Fabric Editor
  * Fabric elements
  * Atlaskit (core)
  * Navigation
  * Media
  * People Teams

  Atlaskit (core) events may result in multiple events being fired for the same action if you have instrumented AK components with your own analytics. In this case we recommend temporarily excluding the atlaskit listener via the 'excludedChannels' prop until we have a fix for this on the backend.

  ## Installation

${code`
  npm install @atlaskit/analytics-listeners
  # or
  yarn add @atlaskit/analytics-listeners
`}

  ## Using the component

  Example firing an analytics-next event:

${code`
  import React from 'react';
  import {
    withAnalyticsEvents,
    createAndFireEvent,
    WithAnalyticsEventsProps
  } from '@atlaskit/analytics-next';
  import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';

  export type Props = WithAnalyticsEventsProps & {
    onClick: (e) => void;
  };

  class DummyComponent extends React.Component<Props> {
    static displayName = 'DummyComponent';

    render() {
      return (
        <div id="dummy" onClick={this.props.onClick}>
          Test
        </div>
      );
    }
  }

  export const DummyComponentWithAnalytics = withAnalyticsEvents({
    onClick: createAndFireEvent('fabric-elements')({
      action: 'someAction',
      actionSubject: 'someComponent',
      eventType: 'ui',
    }),
  })(DummyComponent);

  const myOnClickHandler = (e): void => {
    console.log('component clicked');
  };

  // Pass the analyticsWebClient instance created by the Product
  // Refer to type AnalyticsWebClient from @atlaskit/analytics-listeners
  ReactDOM.render(
    <div>
      <FabricAnalyticsListeners client={analyticsWebClient}>
        <DummyComponentWithAnalytics onClick={myOnClickHandler} />
      </FabricAnalyticsListeners>
    </div>,
    container,
  );
`}
`;
