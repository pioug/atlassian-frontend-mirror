import type { Color as ColorType } from '@atlaskit/status/element';

import type { closingMethods } from '../ui/statusPicker';

export type StatusType = {
	color: ColorType;
	localId?: string;
	text: string;
};

export type StatusState = {
	focusStatusInput?: boolean;
	isNew: boolean;
	showStatusPickerAt: number | null;
};

export interface StatusPluginOptions {
	allowZeroWidthSpaceAfter?: boolean;
	menuDisabled: boolean;
}

export type ClosingPayload = {
	closingMethod: closingMethods;
};
