import React, { useImperativeHandle } from 'react';

import type { CalendarInternalRef } from '../../types';

export default function useInternalRef(
  internalRef: React.Ref<CalendarInternalRef> | undefined,
  {
    navigate,
  }: {
    navigate: CalendarInternalRef['navigate'];
  },
) {
  useImperativeHandle(
    internalRef,
    () => ({
      navigate,
    }),
    [navigate],
  );
}
