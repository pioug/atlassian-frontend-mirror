import { useCallback, useState } from 'react';

export default function useControlled<T>(
  propValue: T | undefined,
  getDefaultPropValue: () => T,
) {
  const isControlled = propValue !== undefined;
  const [valueState, setValue] = useState(getDefaultPropValue);

  const value = isControlled ? propValue : valueState;

  const setValueIfUncontrolled = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setValue(newValue);
      }
    },
    [isControlled],
  );

  return [value as T, setValueIfUncontrolled] as const;
}
