import { AnalyticsContext } from '@atlaskit/analytics-next';
import React from 'react';
import FabricAnalyticsListeners from '../src/FabricAnalyticsListeners';
import { FabricChannel } from '../src/types';
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
const DummyNavigationComponent = createComponentWithAnalytics(
  FabricChannel.navigation,
);
const DummyNotificationsComponent = createComponentWithAnalytics(
  FabricChannel.notifications,
);

const myOnClickHandler = () => {
  console.log('Button clicked ! Yay!');
};

function Example() {
  return (
    <FabricAnalyticsListeners client={createAnalyticsWebClientMock()}>
      <div>
        <DummyElementsComponent onClick={myOnClickHandler} />

        <AnalyticsContext data={{ issueId: 100, greeting: 'hello' }}>
          <AnalyticsContext data={{ issueId: 200 }}>
            <DummyElementsComponentWithAttributes onClick={myOnClickHandler} />
          </AnalyticsContext>
        </AnalyticsContext>

        <DummyAtlaskitComponent onClick={myOnClickHandler} />

        <AnalyticsContext
          data={{
            component: 'page',
            packageName: '@atlaskit/page',
            packageVersion: '2.0.1',
            attributes: { pageName: 'myPage' },
            source: 'homePage',
          }}
        >
          <AnalyticsContext
            data={{
              component: 'myComponent',
              packageName: '@atlaskit/my-component',
              packageVersion: '1.0.0',
              attributes: { customAttr: true },
              source: 'componentPage',
            }}
          >
            <DummyNavigationComponent onClick={myOnClickHandler} />
          </AnalyticsContext>
        </AnalyticsContext>

        <AnalyticsContext data={{ attributes: { customAttribute: 'yes!' } }}>
          <DummyNotificationsComponent onClick={myOnClickHandler} />
        </AnalyticsContext>
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
