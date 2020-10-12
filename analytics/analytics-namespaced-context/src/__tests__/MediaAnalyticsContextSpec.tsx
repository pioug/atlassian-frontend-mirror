import React from 'react';
import { mount } from 'enzyme';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { createDummyComponentWithAnalytics } from '../../examples/helpers';
import { MediaAnalyticsContext } from '../MediaAnalyticsContext';

const MediaComponentWithAnalytics = createDummyComponentWithAnalytics(
  FabricChannel.media,
);

describe('<MediaAnalyticsContext />', () => {
  it('should fire event with Media contextual data', () => {
    const compOnClick = jest.fn();
    const listenerHandler = jest.fn();

    const component = mount(
      <AnalyticsListener
        onEvent={listenerHandler}
        channel={FabricChannel.media}
      >
        <MediaAnalyticsContext
          data={{ fileAttributes: { fileSource: ':shrug:' } }}
        >
          <MediaComponentWithAnalytics onClick={compOnClick} />
        </MediaAnalyticsContext>
      </AnalyticsListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty(
      'channel',
      FabricChannel.media,
    );

    const dummy = analyticsListener.find('#dummy');
    dummy.simulate('click');

    expect(listenerHandler).toBeCalledWith(
      expect.objectContaining({
        context: [{ mediaCtx: { fileAttributes: { fileSource: ':shrug:' } } }],
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
      FabricChannel.media,
    );
  });
});
