import React, { useCallback, useEffect, useRef } from 'react';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';

import { AutoDismissFlagProps } from './types';

import Flag from './flag';
import { useFlagGroup } from './flag-group';
import { name as packageName, version as packageVersion } from './version.json';

export const AUTO_DISMISS_SECONDS = 8;

function noop() {}

const AutoDismissFlag = (props: AutoDismissFlagProps) => {
  const { id, analyticsContext } = props;
  const autoDismissTimer = useRef<number | null>(null);

  const { onDismissed = noop, dismissAllowed } = useFlagGroup();
  const isDismissAllowed = dismissAllowed(id);

  const isAutoDismissAllowed = isDismissAllowed && onDismissed;

  const onDismissedAnalytics = usePlatformLeafEventHandler({
    fn: onDismissed,
    action: 'dismissed',
    analyticsData: analyticsContext,
    componentName: 'flag',
    packageName,
    packageVersion,
  });

  const dismissFlag = useCallback(() => {
    //@ts-expect-error TODO Fix legit TypeScript 3.9.6 improved inference error
    if (isAutoDismissAllowed) {
      onDismissedAnalytics(id);
    }
  }, [id, isAutoDismissAllowed, onDismissedAnalytics]);

  const stopAutoDismissTimer = useCallback(() => {
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current);
      autoDismissTimer.current = null;
    }
  }, []);

  const startAutoDismissTimer = useCallback(() => {
    if (!isAutoDismissAllowed) {
      return;
    }

    stopAutoDismissTimer();

    autoDismissTimer.current = window.setTimeout(
      dismissFlag,
      AUTO_DISMISS_SECONDS * 1000,
    );
  }, [dismissFlag, isAutoDismissAllowed, stopAutoDismissTimer]);

  useEffect(() => {
    startAutoDismissTimer();
    return stopAutoDismissTimer;
  }, [startAutoDismissTimer, stopAutoDismissTimer]);

  return (
    <Flag
      {...props}
      onMouseOver={stopAutoDismissTimer}
      onFocus={stopAutoDismissTimer}
      onMouseOut={startAutoDismissTimer}
      onBlur={startAutoDismissTimer}
    />
  );
};

export default AutoDismissFlag;
