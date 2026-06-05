import React, { useLayoutEffect, useMemo, useState } from 'react';

import { PortalBucket } from './PortalBucket';
import type { PortalManager } from './PortalManager';

export function createPortalRendererComponent(portalManager: PortalManager) {
	return function PortalRenderer(): React.JSX.Element {
		const [buckets, setBuckets] = useState(portalManager.getBuckets());
		useLayoutEffect(() => {
			portalManager.registerPortalRenderer(setBuckets);
			return () => {
				portalManager.unregisterPortalRenderer();
			};
		}, []);
		const portalsElements = useMemo(
			// Ignored via go/ees005
			// eslint-disable-next-line react/no-array-index-key
			() => buckets.map((_, i) => <PortalBucket key={i} id={i} portalManager={portalManager} />),
			[buckets],
		);
		return <>{portalsElements}</>;
	};
}
