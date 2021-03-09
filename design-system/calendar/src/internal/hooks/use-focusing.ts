import React, { useCallback, useEffect, useRef } from 'react';

export default function useFocusing({
  day: [dayValue, setDayValue],
  onBlur,
  onFocus,
}: {
  day: readonly [number, (newValue: number) => void];
  onBlur: React.FocusEventHandler;
  onFocus: React.FocusEventHandler;
}) {
  const dateRef = useRef({
    day: dayValue,
  });

  useEffect(() => {
    dateRef.current = {
      day: dayValue,
    };
  }, [dayValue]);

  const handleContainerBlur = useCallback(
    (event: React.FocusEvent) => {
      setDayValue(0);
      onBlur(event);
    },
    [setDayValue, onBlur],
  );

  const handleContainerFocus = useCallback(
    (event: React.FocusEvent) => {
      setDayValue(dateRef.current.day || 1);
      onFocus(event);
    },
    [setDayValue, onFocus],
  );

  return {
    handleContainerBlur,
    handleContainerFocus,
  };
}
