import { AnalyticsContext } from '@atlaskit/analytics-next';
import React from 'react';
import FabricAnalyticsListeners, { FabricChannel } from '../src';
import {
  createAnalyticsWebClientMock,
  createComponentWithAnalytics,
  createComponentWithAttributesWithAnalytics,
} from './helpers';

const DummyElementsComponent = createComponentWithAnalytics(
  FabricChannel.elements,
);
const DummyElementsComponentWithAttributes = createComponentWithAttributesWithAnalytics(
  FabricChannel.elements,
);
const DummyAtlaskitComponent = createComponentWithAnalytics(
  FabricChannel.atlaskit,
);

const myOnClickHandler = () => {
  console.log('Button clicked ! Yay!');
};

function Example() {
  return (
    <FabricAnalyticsListeners
      client={createAnalyticsWebClientMock()}
      excludedChannels={[FabricChannel.atlaskit]}
    >
      <div>
        <p>Excluding analytics listener</p>
        <DummyElementsComponent onClick={myOnClickHandler} />

        <AnalyticsContext data={{ issueId: 100, greeting: 'hello' }}>
          <AnalyticsContext data={{ issueId: 200 }}>
            <DummyElementsComponentWithAttributes onClick={myOnClickHandler} />
          </AnalyticsContext>
        </AnalyticsContext>

        <DummyAtlaskitComponent onClick={myOnClickHandler} />
      </div>
    </FabricAnalyticsListeners>
  );
}

Object.assign(Example, {
  meta: {
    noListener: true,
  },
});

export default Example;
