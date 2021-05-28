import React, { useCallback, useEffect, useRef } from 'react';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';

import { AutoDismissFlagProps } from './types';

import Flag from './flag';
import { useFlagGroup } from './flag-group';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const AUTO_DISMISS_SECONDS = 8;

function noop() {}

const AutoDismissFlag = (props: AutoDismissFlagProps) => {
  const { id, analyticsContext, onDismissed: onDismissedProp = noop } = props;
  const autoDismissTimer = useRef<number | null>(null);

  const {
    onDismissed: onDismissedFromFlagGroup,
    isDismissAllowed,
  } = useFlagGroup();

  const onDismissed = useCallback(
    (id: string | number, analyticsEvent: UIAnalyticsEvent) => {
      onDismissedProp(id, analyticsEvent);
      onDismissedFromFlagGroup(id, analyticsEvent);
    },
    [onDismissedProp, onDismissedFromFlagGroup],
  );

  const onDismissedAnalytics = usePlatformLeafEventHandler({
    fn: onDismissed,
    action: 'dismissed',
    analyticsData: analyticsContext,
    componentName: 'flag',
    packageName,
    packageVersion,
  });

  const isAutoDismissAllowed = isDismissAllowed && onDismissed;

  const dismissFlag = useCallback(() => {
    if (isAutoDismissAllowed) {
      onDismissedAnalytics(id);
    }
  }, [id, onDismissedAnalytics, isAutoDismissAllowed]);

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
  }, [dismissFlag, stopAutoDismissTimer, isAutoDismissAllowed]);

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
