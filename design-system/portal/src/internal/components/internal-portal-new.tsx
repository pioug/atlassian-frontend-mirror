import React, { Suspense, useState } from 'react';

import { createPortal } from 'react-dom';

import { fg } from '@atlaskit/platform-feature-flags';

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

	/**
	 * Conditionally wrap ALL portal children with Suspense behind a feature gate for safe rollout.
	 *
	 * This is here because in React 18 concurrent, if you suspend from _within_ a portal to a
	 * suspense boundary _outside_ a portal, our portal gets in an infinite loop of re-rendering.
	 */
	const conditionallySuspendedChildren = fg('platform_design_system_suspend_portal_children') ? (
		<Suspense fallback={null}>{children}</Suspense>
	) : (
		children
	);

	return atlaskitPortal ? createPortal(conditionallySuspendedChildren, atlaskitPortal) : null;
}
