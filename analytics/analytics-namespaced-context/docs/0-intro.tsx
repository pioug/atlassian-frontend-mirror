import { md, code } from '@atlaskit/docs';

export default md`
  # Fabric Elements analytics context

  The main purpose of this component is to provide a namespace for Fabric Elements contextual data related to @atlaskit/analytics-next framework.
  Rather than AnalyticsContext from @atlaskit/analytics-next, please use FabricElementsAnalyticsContext.


  ## Installation

${code`
  npm install @atlaskit/analytics-namespaced-context
  # or
  yarn add @atlaskit/analytics-namespaced-context
`}

  ## Using the component

  Example firing an analytics-next event:

${code`
import React from 'react';
import {
  withAnalyticsEvents,
  createAndFireEvent,
  AnalyticsListener,
  WithAnalyticsEventsProps
} from '@atlaskit/analytics-next';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

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
    })
})(DummyComponent);

const listenerHandler = (event, context) => {
  console.log('event: ', event, ' context: ', context);
};

const myOnClickHandler = (e): void => {
  console.log('component clicked');
}

// Pass the analyticsWebClient instance created by the Product
ReactDOM.render(
  <div>
    <AnalyticsListener onEvent={listenerHandler} channel="fabricElements">
      <div>
        <FabricElementsAnalyticsContext data={{ greeting: 'hello' }}>
          <DummyComponentWithAnalytics onClick={myOnClickHandler} />
        </FabricElementsAnalyticsContext>
      </div>
    </AnalyticsListener>
  </div>,
  container,
);
`}
`;
