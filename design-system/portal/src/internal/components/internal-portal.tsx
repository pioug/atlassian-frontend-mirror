import { ReactPortal, useEffect, useMemo } from 'react';

import { createPortal } from 'react-dom';

import {
  appendPortalContainerIfNotAppended,
  createContainer,
  removePortalContainer,
} from '../utils/portal-dom-utils';

interface InternalPortalProps {
  children: React.ReactNode;
  zIndex: number | string;
}
export default function InternalPortal(
  props: InternalPortalProps,
): ReactPortal {
  const { zIndex, children } = props;
  const container = useMemo(() => createContainer(zIndex), [zIndex]);

  // This is in the render method instead of useEffect so that
  // the portal will be added to the DOM before the children render.
  // For any further changes, ensure that the container does not have a
  // parent besides the portal parent.
  appendPortalContainerIfNotAppended(container);

  useEffect(() => {
    return () => {
      removePortalContainer(container);
    };
  }, [container]);

  return createPortal(children, container);
}
