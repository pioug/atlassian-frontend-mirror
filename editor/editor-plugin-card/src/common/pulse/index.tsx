import React, { useCallback } from 'react';

import { Pulse } from '@atlaskit/linking-common';

import {
  isLocalStorageKeyDiscovered,
  markLocalStorageKeyDiscovered,
} from '../local-storage';

export type PulseDiscoveryMode = 'start' | 'iteration';

export interface PulseProps {
  /**
   * The component around which the Pulse should be displayed
   */
  children: JSX.Element;
  /**
   * The key that is used in local storage to identify the descoverability of a feature where the Pulse is used
   */
  localStorageKey: string;

  /**
   * The time in ms after which the key in local storage will be considered expired and the Pulse will be shown again
   */
  localStorageKeyExpirationInMs?: number;

  /**
   * And indicator that the feature was discovered externally and the pulsation needs to stop.
   */
  isDiscovered?: boolean;

  /**
   * Indicates when the feature is considered discovered. If "start" is passed, local storage key will be invalidated
   * as soon as the animation starts. If "iteration" is passed (the default one), it will be invalidated after the first iteration
   */
  discoveryMode?: PulseDiscoveryMode;
}

export const DiscoveryPulse = ({
  children,
  localStorageKey,
  isDiscovered,
  localStorageKeyExpirationInMs,
  discoveryMode = 'iteration',
}: PulseProps) => {
  const discovered =
    isDiscovered || isLocalStorageKeyDiscovered(localStorageKey);

  const onDiscovery = useCallback(() => {
    if (!discovered) {
      markLocalStorageKeyDiscovered(
        localStorageKey,
        localStorageKeyExpirationInMs,
      );
    }
  }, [discovered, localStorageKey, localStorageKeyExpirationInMs]);

  const pulseProps = {
    onAnimationStart: discoveryMode === 'start' ? onDiscovery : undefined,
    onAnimationIteration:
      discoveryMode === 'iteration' ? onDiscovery : undefined,
    isDiscovered: discovered,
  };

  return <Pulse {...pulseProps}>{children}</Pulse>;
};
