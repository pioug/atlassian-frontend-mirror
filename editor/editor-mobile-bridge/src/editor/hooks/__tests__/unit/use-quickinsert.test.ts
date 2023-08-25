import { renderHook } from '@testing-library/react-hooks';
import { useQuickInsert } from '../../use-quickinsert';
import WebBridgeImpl from '../../../native-to-web';

describe('useQuickInsert Hook', () => {
  it('should not configure quick insert when isQuickInsertEnabled is false', () => {
    const bridge = new WebBridgeImpl();
    let isQuickInsertEnabled = false;
    const { result } = renderHook(() =>
      useQuickInsert(bridge, isQuickInsertEnabled),
    );
    expect(result.current).toBe(false);
  });

  it('should configure quick insert  when isQuickInsertEnabled is true', () => {
    const bridge = new WebBridgeImpl();
    let isQuickInsertEnabled = false;
    const { result, rerender } = renderHook(() =>
      useQuickInsert(bridge, isQuickInsertEnabled),
    );
    isQuickInsertEnabled = true;
    rerender();
    expect(result.current).not.toBe(false);
    expect(result!.current).toStrictEqual({ provider: expect.any(Promise) });
  });
});
