import { renderHook, act } from '@testing-library/react-hooks';
import useSelectAndFocusOnArrowNavigation, {
  ensureSafeIndex,
} from '../useSelectAndFocusOnArrowNavigation';

beforeEach(() => {
  jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((cb: Function) => cb());
});

afterEach(() => {
  // @ts-ignore TS2339: Property 'mockRestore' does not exist
  window.requestAnimationFrame.mockRestore();
});

describe('useSelectAndFocusOnArrowNavigation', () => {
  it('sets focused and selected item index', () => {
    const { result } = renderHook(() =>
      useSelectAndFocusOnArrowNavigation(10, 1),
    );
    act(() => {
      result.current.setFocusedItemIndex(5);
    });
    expect(result.current.focusedItemIndex).toStrictEqual(5);
    expect(result.current.selectedItemIndex).toStrictEqual(5);
  });
});

describe('ensureSafeIndex', () => {
  it('returns the safe index as 0 if index <= 0', () => {
    const result = ensureSafeIndex(-1, 10);
    expect(result).toBe(0);
  });
  it('returns the last array index if index === listSize', () => {
    const result = ensureSafeIndex(10, 10);
    expect(result).toBe(10);
  });
  it('returns the last array index if index > listSize', () => {
    const result = ensureSafeIndex(11, 10);
    expect(result).toBe(10);
  });
});
