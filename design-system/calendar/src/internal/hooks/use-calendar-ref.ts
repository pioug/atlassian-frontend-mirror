import React, { useImperativeHandle } from 'react';

import type { CalendarRef } from '../../types';

export default function useCalendarRef(
  calendarRef: React.Ref<CalendarRef> | undefined,
  {
    navigate,
  }: {
    navigate: CalendarRef['navigate'];
  },
) {
  useImperativeHandle(
    calendarRef,
    () => ({
      navigate,
    }),
    [navigate],
  );
}
