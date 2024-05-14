import React, { useLayoutEffect, useMemo, useState } from 'react';

import type { PortalManager } from './PortalManager';

type PortalBucketProps = {
  id: number;
  portalManager: PortalManager;
};

/**
 * A component for rendering portals managed by a `PortalManager`.
 * It subscribes to a `PortalManager` instance to listen for changes in the portal content
 * and renders the content of its assigned portal bucket.
 *
 * @param {PortalBucketProps} props The component props.
 * @param {number} props.id The ID for the portal bucket. This ID is used by the `PortalManager` to manage the content of this bucket.
 * @param {PortalManager} props.portalManager An instance of `PortalManager` which manages the registration and unregistration of portal buckets and their content.
 * @returns {React.ReactElement} The React element(s) that are currently registered to this portal bucket.
 */
export function PortalBucket({ id, portalManager }: PortalBucketProps) {
  // State to hold the current portals for this bucket
  const [portals, setPortals] = useState({});
  // Effect to register/unregister this bucket with the portal manager on mount/unmount
  useLayoutEffect(() => {
    portalManager.registerBucket(id, setPortals);
    return () => {
      portalManager.unregisterBucket(id);
    };
  }, [id, portalManager]);
  // Memoize the portal elements to avoid unnecessary re-renders
  const portalElements = useMemo(() => Object.values(portals), [portals]);
  // Render the current portal elements
  return <>{portalElements}</>;
}
