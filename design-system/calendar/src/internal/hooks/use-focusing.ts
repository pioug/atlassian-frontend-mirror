import React, { useCallback } from 'react';

export default function useFocusing({
  day: [dayValue, setDayValue],
  onBlur,
  onFocus,
}: {
  day: readonly [number, (newValue: number) => void];
  onBlur: React.FocusEventHandler;
  onFocus: React.FocusEventHandler;
}) {
  const handleContainerBlur = useCallback(
    (event: React.FocusEvent) => {
      setDayValue(0);
      onBlur(event);
    },
    [setDayValue, onBlur],
  );

  const handleContainerFocus = useCallback(
    (event: React.FocusEvent) => {
      setDayValue(dayValue || 1);
      onFocus(event);
    },
    [setDayValue, dayValue, onFocus],
  );

  return {
    handleContainerBlur,
    handleContainerFocus,
  };
}
