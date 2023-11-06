import React, { useCallback, useEffect } from 'react';

import { Pulse } from '@atlaskit/linking-common';

import { markLocalStorageKeyDiscovered } from '../local-storage';

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
   * The time in ms since the Pulse has started after which the key will be stored in local storage.
   */
  timeToDiscoverInMs?: number;

  /**
   * And indicator that the feature was discovered externally and the pulsation needs to stop.
   */
  isDiscovered?: boolean;
}

export const DiscoveryPulse = ({
  children,
  localStorageKey,
  isDiscovered,
  timeToDiscoverInMs,
  localStorageKeyExpirationInMs,
}: PulseProps) => {
  const onDiscovery = useCallback(() => {
    markLocalStorageKeyDiscovered(
      localStorageKey,
      localStorageKeyExpirationInMs,
    );
  }, [localStorageKey, localStorageKeyExpirationInMs]);

  useEffect(() => {
    if (timeToDiscoverInMs) {
      const timeoutUntilDiscovery = setTimeout(() => {
        onDiscovery();
      }, timeToDiscoverInMs);

      return () => clearTimeout(timeoutUntilDiscovery);
    }

    onDiscovery();
  }, [isDiscovered, localStorageKey, onDiscovery, timeToDiscoverInMs]);

  return <Pulse isDiscovered={isDiscovered}>{children}</Pulse>;
};

export default Pulse;
