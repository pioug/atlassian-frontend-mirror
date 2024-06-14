import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { Color as ColorType } from '@atlaskit/status/element';

import type { closingMethods } from './ui/statusPicker';

export type StatusType = {
	color: ColorType;
	text: string;
	localId?: string;
};

export type StatusState = {
	isNew: boolean;
	showStatusPickerAt: number | null;
	focusStatusInput?: boolean;
};

export interface StatusPluginOptions {
	menuDisabled: boolean;
	allowZeroWidthSpaceAfter?: boolean;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
}

export type ClosingPayload = {
	closingMethod: closingMethods;
};
