import React, { useImperativeHandle } from 'react';

import type { CalendarRef } from '../../types';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
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
