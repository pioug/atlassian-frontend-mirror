import { renderHook } from '@testing-library/react-hooks';

import { useSmartLinkAnalytics } from '../useSmartLinkAnalytics';
import { mocks } from '../../../utils/mocks';
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
});
