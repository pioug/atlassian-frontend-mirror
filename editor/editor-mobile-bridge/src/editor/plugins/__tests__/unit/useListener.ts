import { renderHook } from '@testing-library/react-hooks';
import { useListener } from '../../useListener';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import type WebBridgeImpl from '../../../native-to-web';

describe('useListener', () => {
  it('should not call the callback on the first render', () => {
    const callback = jest.fn();

    renderHook(() => useListener(callback, [], undefined));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call the callback on the first render if sendInitialState is true', () => {
    const callback = jest.fn();

    renderHook(() => useListener(callback, [], undefined, true));

    expect(callback).toHaveBeenCalled();
  });

  it('should call the callback on dependencies change', () => {
    const callback = jest.fn();

    const { rerender } = renderHook(
      ({ value }) => useListener(callback, [value], undefined),
      { initialProps: { value: 1 } },
    );

    rerender({ value: 2 });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call the cleanup function on unmount if the callback has been called at least once', () => {
    const cleanup = jest.fn();
    const callback = () => cleanup;

    const { rerender, unmount } = renderHook(
      ({ value }) => useListener(callback, [value], undefined),
      { initialProps: { value: 1 } },
    );

    // Ensure that the callback is executed at least once
    rerender({ value: 2 });

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('should update the bridge key if set on the listener', () => {
    const cleanup = jest.fn();
    const callback = () => cleanup;

    const bridge = { listBridgeState: null };
    const testListState = {
      bulletListActive: true,
      bulletListDisabled: false,
      orderedListActive: false,
      orderedListDisabled: false,
      decorationSet: DecorationSet.empty,
    };

    const { rerender } = renderHook<
      {
        value: WebBridgeImpl['listBridgeState'] | null;
      },
      void
    >(
      ({ value }) =>
        useListener(callback, [value], {
          bridge: bridge as WebBridgeImpl,
          key: 'listBridgeState',
          state: value,
        }),
      { initialProps: { value: null } },
    );
    expect(bridge.listBridgeState).toBe(null);

    // Ensure that the callback is executed at least once
    rerender({ value: testListState });
    expect(bridge.listBridgeState).toStrictEqual(testListState);
  });
});
