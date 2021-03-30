import { ReactPortal, useLayoutEffect, useMemo } from 'react';

import { createPortal } from 'react-dom';

import {
  appendPortalContainer,
  createContainer,
  removePortalContainer,
  removePortalParentContainerIfNoMorePortals,
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

  useLayoutEffect(() => {
    appendPortalContainer(container);

    return () => {
      removePortalContainer(container);

      removePortalParentContainerIfNoMorePortals();
    };
  }, [container]);

  return createPortal(children, container);
}
