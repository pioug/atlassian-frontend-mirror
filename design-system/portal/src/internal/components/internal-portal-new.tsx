import React, { Suspense, useState } from 'react';

import { createPortal } from 'react-dom';

import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect';
import { createAtlaskitPortal, createPortalParent } from '../utils/portal-dom-utils';

interface InternalPortalProps {
	children: React.ReactNode;
	zIndex: number | string;
}

export default function InternalPortalNew(props: InternalPortalProps): React.ReactPortal | null {
	const { zIndex, children } = props;
	const [atlaskitPortal, setAtlaskitPortal] = useState<HTMLDivElement | undefined | null>(null);

	useIsomorphicLayoutEffect(() => {
		const tempPortalContainer = createAtlaskitPortal(zIndex);
		setAtlaskitPortal(tempPortalContainer);
		const portalParent = createPortalParent();
		if (!tempPortalContainer || !portalParent) {
			return;
		}
		portalParent.appendChild(tempPortalContainer);
		return () => {
			if (tempPortalContainer) {
				portalParent.removeChild(tempPortalContainer);
			}
			setAtlaskitPortal(null);
		};
	}, [zIndex]);

	/**
	 * We wrap portal children with a Suspense boundary because in React 18 concurrent,
	 * if you suspend from _within_ a portal to a Suspense boundary _outside_ the portal,
	 * our portal gets in an infinite loop of rendering.
	 */
	const suspendedChildren = <Suspense fallback={null}>{children}</Suspense>;

	return atlaskitPortal ? createPortal(suspendedChildren, atlaskitPortal) : null;
}
