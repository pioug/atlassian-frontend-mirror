import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import '@atlaskit/link-test-helpers/jest';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { useSmartLinkAnalytics } from '../useSmartLinkAnalytics';
import { mocks } from '../../../utils/mocks';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import { CardDisplay } from '../../../constants';

jest.mock('@atlaskit/link-provider', () => ({
  useSmartLinkContext: () => ({
    store: { getState: () => ({ 'test-url': mocks.analytics }) },
  }),
}));

const url = 'test-url';

describe('useSmartLinkAnalytics', () => {
  it('fires a specified event', () => {
    let mockedAnalyticsHandler = jest.fn();
    const { result } = renderHook(() =>
      useSmartLinkAnalytics(url, mockedAnalyticsHandler),
    );
    result.current.ui.cardClickedEvent({
      id: 'test-id',
      display: CardDisplay.Flexible,
      status: 'resolved',
    });
    expect(mockedAnalyticsHandler).toBeCalled();
    expect(mockedAnalyticsHandler).toBeCalledWith({
      action: 'clicked',
      actionSubject: 'smartLink',
      attributes: {
        id: 'test-id',
        componentName: 'smart-cards',
        display: 'flexible',
        definitionId: 'spaghetti-id',
        extensionKey: 'spaghetti-key',
        destinationProduct: 'spaghetti-product',
        destinationSubproduct: 'spaghetti-subproduct',
        packageName: '@atlaskit/smart-card',
        packageVersion: '999.9.9',
        status: 'resolved',
        resourceType: 'spaghetti-resource',
      },
      eventType: 'ui',
    });
  });

  describe('without `dispatchAnalytics`', () => {
    it('fires a specified event using @atlaskit/analytics-next if no dispatch handler is provided', () => {
      const spy = jest.fn();

      const { result } = renderHook(() => useSmartLinkAnalytics(url), {
        wrapper: ({ children }) => (
          <AnalyticsListener onEvent={spy} channel={ANALYTICS_CHANNEL}>
            {children}
          </AnalyticsListener>
        ),
      });

      result.current.ui.cardClickedEvent({
        id: 'test-id',
        display: CardDisplay.Flexible,
        status: 'resolved',
      });

      expect(spy).toBeFiredWithAnalyticEventOnce({
        payload: {
          action: 'clicked',
          actionSubject: 'smartLink',
          attributes: {
            id: 'test-id',
            componentName: 'smart-cards',
            display: 'flexible',
            definitionId: 'spaghetti-id',
            extensionKey: 'spaghetti-key',
            destinationProduct: 'spaghetti-product',
            destinationSubproduct: 'spaghetti-subproduct',
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
            status: 'resolved',
            resourceType: 'spaghetti-resource',
          },
          eventType: 'ui',
        },
      });
    });
  });
});
