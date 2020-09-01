import { renderHook, act } from '@testing-library/react-hooks';
import { replaceRaf } from 'raf-stub';
import useSelectAndFocusOnArrowNavigation, {
  ensureSafeIndex,
} from '../use-select-and-focus-on-arrow-navigation';

replaceRaf();

describe('useSelectAndFocusOnArrowNavigation', () => {
  it('sets focused and selected item index', () => {
    const { result } = renderHook(() =>
      useSelectAndFocusOnArrowNavigation(10, 1),
    );
    act(() => {
      result.current.setFocusedItemIndex(5);
      // @ts-ignore using raf-stub, this method will exist for this scope.
      requestAnimationFrame.step();
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
