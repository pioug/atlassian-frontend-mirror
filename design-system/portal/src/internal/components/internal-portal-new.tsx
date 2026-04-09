import React, { Suspense, useState } from 'react';

import { createPortal } from 'react-dom';

import { ThemeProvider, useColorMode } from '@atlaskit/app-provider';
import { fg } from '@atlaskit/platform-feature-flags';

import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect';
import { createAtlaskitPortal } from '../utils/create-atlaskit-portal';
import { createPortalParent } from '../utils/create-portal-parent';
import { removePortalParent } from '../utils/remove-portal-parent';

interface InternalPortalProps {
	children: React.ReactNode;
	zIndex: number | string;
	isClosed?: boolean;
}

export default function InternalPortalNew(props: InternalPortalProps): React.ReactPortal | null {
	const { zIndex, children, isClosed } = props;
	const [atlaskitPortal, setAtlaskitPortal] = useState<HTMLDivElement | undefined | null>(null);

	const colorMode = useColorMode();

	useIsomorphicLayoutEffect(() => {
		if (fg('import_into_jsm_in_template_gallery_killswitch')) {
			if (!isClosed) {
				let tempPortalContainer = createAtlaskitPortal(zIndex);
				setAtlaskitPortal(tempPortalContainer);
				const portalParent = createPortalParent();
				if (!tempPortalContainer || !portalParent) {
					return;
				}
				portalParent.appendChild(tempPortalContainer);
				return () => {
					if (portalParent) {
						portalParent.removeChild(tempPortalContainer);
						!portalParent.hasChildNodes() && removePortalParent(portalParent);
					}
					setAtlaskitPortal(null);
				};
			}
		} else {
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
		}
	}, [zIndex, isClosed, fg]);

	/**
	 * We wrap portal children with a Suspense boundary because in React 18 concurrent,
	 * if you suspend from _within_ a portal to a Suspense boundary _outside_ the portal,
	 * our portal gets in an infinite loop of rendering.
	 */
	const suspendedChildren = (
		<Suspense fallback={null}>
			{colorMode ? (
				<ThemeProvider defaultColorMode={colorMode}>{children}</ThemeProvider>
			) : (
				children
			)}
		</Suspense>
	);

	return atlaskitPortal ? createPortal(suspendedChildren, atlaskitPortal) : null;
}
