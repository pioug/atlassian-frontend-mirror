import { renderHook } from '@testing-library/react-hooks';

import { useSmartLinkAnalytics } from '../useSmartLinkAnalytics';

jest.mock('@atlaskit/link-provider', () => ({
  useSmartLinkContext: () => ({
    store: {
      getState: () => ({
        'test-url': {
          status: 'resolved',
          details: {
            meta: {
              definitionId: 'spaghetti-id',
              key: 'spaghetti-key',
              resourceType: 'spaghetti-resource',
              subproduct: 'spaghetti-subproduct',
              product: 'spaghetti-product',
            },
          },
        },
      }),
    },
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
      display: 'flexible',
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
});
