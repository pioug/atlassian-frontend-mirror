import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import InternalPortal from './internal/components/internal-portal';
import InternalPortalNew from './internal/components/internal-portal-new';
import useIsSubsequentRender from './internal/hooks/use-is-subsequent-render';
import useFirePortalEvent from './internal/hooks/use-portal-event';
import type { PortalProps } from './types';

/**
 * @deprecated The browser top layer renders layered UI above the page without a portal. Use a
 * design system layer component (for example Popup, Tooltip or Modal dialog), or `Popover` and
 * `Dialog` from `@atlaskit/top-layer`. Content portalled to `document.body` renders below every open
 * top-layer surface. Design system components still use Portal on their `platform-dst-top-layer`
 * gate-off path.
 */
export default function Portal({
	zIndex = 0,
	children,
	mountStrategy = 'effect',
}: PortalProps): React.JSX.Element | null {
	const isSubsequentRender = useIsSubsequentRender(mountStrategy);

	useFirePortalEvent(zIndex);

	return !fg('platform_design_system_team_portal_logic_r18_fix') ? (
		isSubsequentRender ? (
			<InternalPortal zIndex={zIndex}>{children}</InternalPortal>
		) : null
	) : (
		<InternalPortalNew zIndex={zIndex}>{children}</InternalPortalNew>
	);
}
