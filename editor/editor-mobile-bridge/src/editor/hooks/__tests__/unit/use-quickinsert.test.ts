import { renderHook } from '@testing-library/react-hooks';
import { useQuickInsert } from '../../use-quickinsert';
import WebBridgeImpl from '../../../native-to-web';
import { IntlShape } from 'react-intl-next';
import { processQuickInsertItems } from '@atlaskit/editor-core';

const mockSomeDefaultItems = [
  {
    title: 'neko is sleepy',
    action: (insert: any) => insert(),
  },
];

jest.mock('@atlaskit/editor-core', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-core'),
  quickInsertPluginKey: {
    getState: () => ({
      lazyDefaultItems: () => [],
    }),
  },
  processQuickInsertItems: jest
    .fn()
    .mockImplementation(() => mockSomeDefaultItems),
}));

describe('useQuickInsert Hook', () => {
  const intlMock = {
    formatMessage: (messageDescriptor: any) =>
      messageDescriptor && messageDescriptor.defaultMessage,
  } as unknown as IntlShape;

  it('should not configure quick insert when isQuickInsertEnabled is false', () => {
    const bridge = new WebBridgeImpl();
    let isQuickInsertEnabled = false;
    const { result } = renderHook(() =>
      useQuickInsert(bridge, intlMock, isQuickInsertEnabled),
    );
    expect(result.current).toBe(false);
  });

  it('should configure quick insert  when isQuickInsertEnabled is true', () => {
    const bridge = new WebBridgeImpl();
    let isQuickInsertEnabled = false;
    const { result, rerender } = renderHook(() =>
      useQuickInsert(bridge, intlMock, isQuickInsertEnabled),
    );
    isQuickInsertEnabled = true;
    rerender();
    expect(result.current).not.toBe(false);
    expect(result!.current).toStrictEqual({ provider: expect.any(Promise) });
  });

  describe('setQuickInsertItems', () => {
    const mockSomeQuickInsertItems = [
      {
        title: 'mochi is fluffy',
        action: (insert: any) => insert(),
      },
    ];

    it('should call `setQuickInsertItems` on bridge when intl changes', async () => {
      const bridge = new WebBridgeImpl();
      // to force hook to `processQuickInsertItems`
      (bridge as any).editorView = true;

      const spy = jest.spyOn(bridge, 'setQuickInsertItems');
      const { result, rerender } = renderHook((intlMockOpt?: IntlShape) => {
        return useQuickInsert(bridge, intlMockOpt || intlMock, true);
      });

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(mockSomeDefaultItems);
      expect(await bridge.quickInsertItems).toEqual(mockSomeDefaultItems);

      (processQuickInsertItems as jest.Mock).mockImplementation(
        () => mockSomeQuickInsertItems,
      );

      rerender({
        formatMessage: (messageDescriptor: any) =>
          messageDescriptor && messageDescriptor.defaultMessage,
      } as unknown as IntlShape);

      expect(result.current).not.toBe(false);
      expect(result!.current).toStrictEqual({ provider: expect.any(Promise) });

      expect(spy).toBeCalledTimes(2);
      expect(spy).toBeCalledWith(mockSomeQuickInsertItems);
      expect(await bridge.quickInsertItems).toEqual(mockSomeQuickInsertItems);
    });
  });
});
