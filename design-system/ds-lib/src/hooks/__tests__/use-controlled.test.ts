import { act, renderHook } from '@testing-library/react-hooks';

import useControlled from '../use-controlled';

describe('#useControlled', () => {
  const getDefaultPropValue = () => false;
  it('should not change value when it is controlled component via setValueIfUncontrolled', () => {
    const propValue = true;
    const renderHookResult = renderHook(() =>
      useControlled<boolean>(propValue),
    );
    const [value, setValueIfUncontrolled] = renderHookResult.result.current;

    expect(value).toBe(propValue);
    act(() => {
      setValueIfUncontrolled(false);
    });
    // since controlled so value will remain as is
    expect(value).toBe(propValue);
  });
  it('should change value when it is uncontrolled component via setValueIfUncontrolled', () => {
    const propValue = undefined; // uncontrolled
    const renderHookResult = renderHook(() =>
      useControlled<boolean>(propValue, getDefaultPropValue),
    );
    const [value, setValueIfUncontrolled] = renderHookResult.result.current;

    expect(value).toBe(false);
    // since uncontrolled so value will change
    act(() => {
      setValueIfUncontrolled(true);
    });
    const newValue = renderHookResult.result.current[0];
    expect(newValue).toBe(true);
  });
});
