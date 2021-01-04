import { renderHook } from '@testing-library/react-hooks';
import { useQuickInsert } from '../../use-quickinsert';
import WebBridgeImpl from '../../../native-to-web';
import { InjectedIntl } from 'react-intl';

describe('useQuickInsert Hook', () => {
  const intlMock = ({
    formatMessage: (messageDescriptor: any) =>
      messageDescriptor && messageDescriptor.defaultMessage,
  } as unknown) as InjectedIntl;

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
});
