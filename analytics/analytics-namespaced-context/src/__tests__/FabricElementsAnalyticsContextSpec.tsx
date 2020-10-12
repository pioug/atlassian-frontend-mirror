import React from 'react';
import { mount } from 'enzyme';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { createDummyComponentWithAnalytics } from '../../examples/helpers';
import { FabricElementsAnalyticsContext } from '../FabricElementsAnalyticsContext';

const ElementsComponentWithAnalytics = createDummyComponentWithAnalytics(
  FabricChannel.elements,
);

describe('<FabricElementsAnalyticsContext />', () => {
  it('should fire event with Fabric Elements contextual data', () => {
    const compOnClick = jest.fn();
    const listenerHandler = jest.fn();

    const component = mount(
      <AnalyticsListener
        onEvent={listenerHandler}
        channel={FabricChannel.elements}
      >
        <FabricElementsAnalyticsContext data={{ greeting: 'hello' }}>
          <ElementsComponentWithAnalytics onClick={compOnClick} />
        </FabricElementsAnalyticsContext>
      </AnalyticsListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty(
      'channel',
      FabricChannel.elements,
    );

    const dummy = analyticsListener.find('#dummy');
    dummy.simulate('click');

    expect(listenerHandler).toBeCalledWith(
      expect.objectContaining({
        context: [{ fabricElementsCtx: { greeting: 'hello' } }],
        payload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          attributes: {
            componentName: 'foo',
            foo: 'bar',
            packageName: '@atlaskit/foo',
            packageVersion: '1.0.0',
          },
          eventType: 'ui',
        },
      }),
      FabricChannel.elements,
    );
  });
});
