import React from 'react';

import InternalPortal from './internal/components/internal-portal';
import useIsSubsequentRender from './internal/hooks/use-is-subsequent-render';
import useFirePortalEvent from './internal/hooks/use-portal-event';
import type { PortalProps } from './types';

export default function Portal(props: PortalProps) {
  const { zIndex = 0, children } = props;
  const isSubsequentRender = useIsSubsequentRender();

  useFirePortalEvent(zIndex);

  return isSubsequentRender ? (
    <InternalPortal zIndex={zIndex}>{children}</InternalPortal>
  ) : null;
}
