import React, { useCallback, useEffect, useRef } from 'react';

import type { SelectEvent } from '../../types';
import { arrowKeys } from '../constants';
import type { ArrowKeys, DateObj } from '../types';
import dateToString from '../utils/date-to-string';

export default function useHandleDateSelect({
  day: [dayValue],
  month: [monthValue],
  year: [yearValue],
  selected: [selectedValue, setSelectedValue],
  previous: [, setPreviouslySelectedValue],
  onSelect,
  navigate,
}: {
  day: readonly [number, (newValue: number) => void];
  month: readonly [number, (newValue: number) => void];
  year: readonly [number, (newValue: number) => void];
  selected: [string[], (newValue: string[]) => void];
  previous: [unknown, (newValue: string[]) => void];
  onSelect: (event: SelectEvent) => void;
  navigate: (type: ArrowKeys) => void;
}) {
  const dateRef = useRef({
    day: dayValue,
    month: monthValue,
    year: yearValue,
  });

  useEffect(() => {
    dateRef.current = {
      day: dayValue,
      month: monthValue,
      year: yearValue,
    };
  }, [dayValue, monthValue, yearValue]);

  const triggerOnSelect = useCallback(
    ({ year, month, day }: Omit<SelectEvent, 'iso'>) => {
      const iso = dateToString({ year, month, day });
      onSelect({ day, month, year, iso });

      setPreviouslySelectedValue(selectedValue);
      setSelectedValue([iso]);
    },
    [onSelect, selectedValue, setPreviouslySelectedValue, setSelectedValue],
  );

  const handleClickDay = useCallback(
    ({ year, month, day }: DateObj) => {
      triggerOnSelect({ year, month, day });
    },
    [triggerOnSelect],
  );

  const handleContainerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const { key } = e;
      const arrowKey = arrowKeys[key];

      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        triggerOnSelect(dateRef.current);
      } else if (arrowKey) {
        e.preventDefault();
        navigate(arrowKey);
      }
    },
    [triggerOnSelect, navigate],
  );

  return {
    handleClickDay,
    handleContainerKeyDown,
  };
}
