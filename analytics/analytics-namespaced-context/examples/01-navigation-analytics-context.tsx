import { FabricChannel } from '@atlaskit/analytics-listeners';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import React from 'react';
import { createDummyComponentWithAnalytics } from '../examples/helpers';
import { NavigationAnalyticsContext } from '../src';

const myOnClickHandler = () => {};

const listenerHandler = (event: UIAnalyticsEvent, channel?: string) => {
  console.log('listenerHandler, event: ', event, ' channel: ', channel);
};

const ElementsComponentWithAnalytics = createDummyComponentWithAnalytics(
  FabricChannel.navigation,
);

export default function Example() {
  return (
    <AnalyticsListener
      onEvent={listenerHandler}
      channel={FabricChannel.navigation}
    >
      <div>
        <NavigationAnalyticsContext data={{ greeting: 'hello' }}>
          <ElementsComponentWithAnalytics onClick={myOnClickHandler} />
        </NavigationAnalyticsContext>
      </div>
    </AnalyticsListener>
  );
}
