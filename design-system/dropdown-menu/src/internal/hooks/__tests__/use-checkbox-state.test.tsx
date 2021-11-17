import { act, renderHook } from '@testing-library/react-hooks';

import useCheckboxState from '../use-checkbox-state';

describe('#useCheckBoxIsSelectedHook', () => {
  it('should be able to setSelected for defaultSelected', () => {
    const result = renderHook(() =>
      useCheckboxState({
        id: 'melbourne',
        isSelected: undefined,
        defaultSelected: true,
      }),
    );
    const [selected, setSelected] = result.result.current;

    expect(selected).toBe(true);

    act(() => {
      setSelected(() => false);
    });

    const [newValue] = result.result.current;
    expect(newValue).toBe(false);
  });

  it('should not be able to setSelected when isSelected is provided', () => {
    const result = renderHook(() =>
      useCheckboxState({
        id: 'melbourne',
        isSelected: true,
        defaultSelected: undefined,
      }),
    );
    const [selected, setSelected] = result.result.current;

    expect(selected).toBe(true);

    act(() => {
      setSelected(() => false);
    });

    const [newValue] = result.result.current;
    expect(newValue).toBe(true);
  });

  it('should return false when both defaultSelected and isSelected are undefined', () => {
    const result = renderHook(() =>
      useCheckboxState({
        id: 'melbourne',
        isSelected: undefined,
        defaultSelected: undefined,
      }),
    );
    const [selected, setSelected] = result.result.current;

    expect(selected).toBe(false);

    act(() => {
      setSelected(() => true);
    });

    const [newValue] = result.result.current;
    expect(newValue).toBe(true);
  });
});
