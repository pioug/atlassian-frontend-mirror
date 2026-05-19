// Disable no-re-export here, this is a useful mapping file for icon lookup used in multiple places
/* eslint-disable @atlaskit/editor/no-re-export */

import type { Valign } from '@atlaskit/editor-common/types/valign';
import AlignContentBottomIcon from '@atlaskit/icon-lab/core/align-content-bottom';
import AlignContentCenterVerticalIcon from '@atlaskit/icon-lab/core/align-content-center-vertical';
import AlignContentTopIcon from '@atlaskit/icon-lab/core/align-content-top';

type VerticalAlignIcon = typeof AlignContentTopIcon;

export const VERTICAL_ALIGN_ICONS: Record<Valign, VerticalAlignIcon> = {
	top: AlignContentTopIcon,
	middle: AlignContentCenterVerticalIcon,
	bottom: AlignContentBottomIcon,
};
