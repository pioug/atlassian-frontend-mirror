import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import InternalPortal from './internal/components/internal-portal';
import InternalPortalNew from './internal/components/internal-portal-new';
import useIsSubsequentRender from './internal/hooks/use-is-subsequent-render';
import useFirePortalEvent from './internal/hooks/use-portal-event';
import type { PortalProps } from './types';

export default function Portal({ zIndex = 0, children, mountStrategy = 'effect' }: PortalProps) {
	const isSubsequentRender = useIsSubsequentRender(mountStrategy);

	useFirePortalEvent(zIndex);

	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	return !fg('dsp-19516-design-system-portal-logic-update') ? (
		isSubsequentRender ? (
			<InternalPortal zIndex={zIndex}>{children}</InternalPortal>
		) : null
	) : (
		<InternalPortalNew zIndex={zIndex}>{children}</InternalPortalNew>
	);
}
