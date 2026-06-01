// Disable no-re-export here, this is a useful mapping file for icon lookup used in multiple places
/* eslint-disable @atlaskit/editor/no-re-export */

import type { Valign } from '@atlaskit/adf-schema/layout-column';
import AlignPositionBottomIcon from '@atlaskit/icon-lab/core/align-position-bottom';
import AlignPositionCenterVerticalIcon from '@atlaskit/icon-lab/core/align-position-center-vertical';
import AlignPositionTopIcon from '@atlaskit/icon-lab/core/align-position-top';

type VerticalAlignIcon = typeof AlignPositionTopIcon;

export const VERTICAL_ALIGN_ICONS: Record<Valign, VerticalAlignIcon> = {
	top: AlignPositionTopIcon,
	middle: AlignPositionCenterVerticalIcon,
	bottom: AlignPositionBottomIcon,
};
