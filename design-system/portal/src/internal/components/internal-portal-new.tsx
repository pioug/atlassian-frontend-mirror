import { useState } from 'react';

import { createPortal } from 'react-dom';

import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect';
import { createAtlaskitPortal, createPortalParent } from '../utils/portal-dom-utils';

interface InternalPortalProps {
	children: React.ReactNode;
	zIndex: number | string;
}

export default function InternalPortalNew(props: InternalPortalProps) {
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

	return atlaskitPortal ? createPortal(children, atlaskitPortal) : null;
}
