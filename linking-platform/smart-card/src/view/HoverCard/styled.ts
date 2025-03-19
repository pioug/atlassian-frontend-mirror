import { layers } from '@atlaskit/theme/constants';

import { SmartLinkSize } from '../../constants';
import { type InternalFlexibleUiOptions } from '../FlexibleCard/types';

// Temporary fix for Confluence inline comment on editor mod has z-index of 500, Jira issue view has z-index of 510
export const HOVER_CARD_Z_INDEX = layers.modal();

export const flexibleUiOptions: InternalFlexibleUiOptions = {
	hideBackground: true,
	hideElevation: true,
	hideLegacyButton: true,
	size: SmartLinkSize.Medium,
	zIndex: HOVER_CARD_Z_INDEX + 1,
};

export const CARD_WIDTH_REM = 24;
export const CARD_GAP_PX = 10; // gap between mouse cursor and hover card
