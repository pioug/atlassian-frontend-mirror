import { renderHook } from '@testing-library/react-hooks';
import { useQuickInsertListener } from '../../useQuickInsertListener';
import WebBridgeImpl from '../../../native-to-web';
import type { IntlShape } from 'react-intl-next';
import { memoProcessQuickInsertItems } from '@atlaskit/editor-common/quick-insert';
import type { QuickInsertSharedState } from '@atlaskit/editor-common/types';

const mockSomeDefaultItems = [
  {
    title: 'neko is sleepy',
    action: (insert: any) => insert(),
  },
];

jest.mock('@atlaskit/editor-common/quick-insert', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/quick-insert'),
  memoProcessQuickInsertItems: jest
    .fn()
    .mockImplementation(() => mockSomeDefaultItems),
}));

describe('Quick-insert plugin state listener', () => {
  const quickInsertSharedStateMock: QuickInsertSharedState = {
    lazyDefaultItems: () => [],
    isElementBrowserModalOpen: false,
  };

  const mockSomeQuickInsertItems = [
    {
      title: 'mochi is fluffy',
      action: (insert: any) => insert(),
    },
  ];

  it('should call set the quick-insert suggestions on the bridge when intl changes', async () => {
    const bridge = new WebBridgeImpl();
    const setQuickInsertItemsSpy = jest.spyOn(bridge, 'setQuickInsertItems');

    // Initial render
    const intlMock = {
      formatMessage: (messageDescriptor: any) =>
        messageDescriptor?.defaultMessage,
    } as unknown as IntlShape;
    const { rerender } = renderHook<
      {
        intl: IntlShape;
      },
      void
    >(
      ({ intl }) =>
        useQuickInsertListener(quickInsertSharedStateMock, bridge, intl),
      {
        initialProps: {
          intl: intlMock,
        },
      },
    );

    expect(setQuickInsertItemsSpy).toBeCalledTimes(1);
    expect(setQuickInsertItemsSpy).toBeCalledWith(mockSomeDefaultItems);
    expect(await bridge.quickInsertItems).toEqual(mockSomeDefaultItems);

    (memoProcessQuickInsertItems as jest.Mock).mockImplementation(
      () => mockSomeQuickInsertItems,
    );

    // Intl changes
    const newIntlMock = {
      formatMessage: (messageDescriptor: any) =>
        messageDescriptor?.defaultMessage,
    } as unknown as IntlShape;
    rerender({
      intl: newIntlMock,
    });

    expect(setQuickInsertItemsSpy).toBeCalledTimes(2);
    expect(setQuickInsertItemsSpy).toBeCalledWith(mockSomeQuickInsertItems);
    expect(await bridge.quickInsertItems).toEqual(mockSomeQuickInsertItems);
  });
});
