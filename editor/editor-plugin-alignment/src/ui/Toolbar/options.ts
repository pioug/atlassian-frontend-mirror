import { alignmentMessages as messages } from '@atlaskit/editor-common/alignment';
import { alignCenter, alignLeft, alignRight } from '@atlaskit/editor-common/keymaps';
import {
	ALIGN_LEFT_MENU_ITEM,
	ALIGN_CENTER_MENU_ITEM,
	ALIGN_RIGHT_MENU_ITEM,
} from '@atlaskit/editor-common/toolbar/keys';
import { ALIGNMENT_MENU_SECTION_RANK } from '@atlaskit/editor-common/toolbar/rank';
import { AlignTextCenterIcon } from '@atlaskit/editor-toolbar/align-text-center-icon';
import { AlignTextLeftIcon } from '@atlaskit/editor-toolbar/align-text-left-icon';
import { AlignTextRightIcon } from '@atlaskit/editor-toolbar/align-text-right-icon';

import type { AlignmentState } from '../../pm-plugins/types';
import type { OptionInfo } from './types';

export const alignmentOptions = (): Record<AlignmentState, OptionInfo> => ({
	start: {
		key: ALIGN_LEFT_MENU_ITEM.key,
		type: ALIGN_LEFT_MENU_ITEM.type,
		rank: ALIGNMENT_MENU_SECTION_RANK[ALIGN_LEFT_MENU_ITEM.key],
		label: messages.alignLeft,
		icon: AlignTextLeftIcon,
		keymap: alignLeft,
	},
	center: {
		key: ALIGN_CENTER_MENU_ITEM.key,
		type: ALIGN_CENTER_MENU_ITEM.type,
		rank: ALIGNMENT_MENU_SECTION_RANK[ALIGN_CENTER_MENU_ITEM.key],
		label: messages.alignCenter,
		icon: AlignTextCenterIcon,
		keymap: alignCenter,
	},
	end: {
		key: ALIGN_RIGHT_MENU_ITEM.key,
		type: ALIGN_RIGHT_MENU_ITEM.type,
		rank: ALIGNMENT_MENU_SECTION_RANK[ALIGN_RIGHT_MENU_ITEM.key],
		label: messages.alignRight,
		icon: AlignTextRightIcon,
		keymap: alignRight,
	},
});
