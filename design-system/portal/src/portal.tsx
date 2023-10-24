import React from 'react';

import InternalPortal from './internal/components/internal-portal';
import useIsSubsequentRender from './internal/hooks/use-is-subsequent-render';
import useFirePortalEvent from './internal/hooks/use-portal-event';
import type { PortalProps } from './types';

export default function Portal({
  zIndex = 0,
  children,
  mountStrategy = 'effect',
}: PortalProps) {
  const isSubsequentRender = useIsSubsequentRender(mountStrategy);

  useFirePortalEvent(zIndex);

  return isSubsequentRender ? (
    <InternalPortal zIndex={zIndex}>{children}</InternalPortal>
  ) : null;
}
