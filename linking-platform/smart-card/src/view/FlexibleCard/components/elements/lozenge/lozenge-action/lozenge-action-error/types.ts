import { messages } from '../../../../../../../messages';
import { type PreviewActionData } from '../../../../../../../state/flexible-ui-context/types';
import { type MessageProps } from '../../../../types';

export type LozengeActionErrorProps = {
	/**
	 * Error message to be displayed inside the dropdown
	 */
	errorMessage: string | MessageProps;

	/**
	 * Data test id used for testing purposes
	 */
	testId?: string;

	/**
	 * Maximum number of lines displayed inside of the dropdown
	 */
	maxLineNumber?: number;

	/**
	 * The url of the link. Used in reload functionality
	 */
	url?: string;

	/**
	 * Preview Modal information. If present, will be used to render an embed modal on an error link click
	 */
	previewData?: PreviewActionData | null;
};

export const LozengeActionErrorMessages = {
	noData: {
		descriptor: messages['status_change_permission_error'],
	},
	unknown: {
		descriptor: messages['status_change_load_error'],
	},
	updateFailed: {
		descriptor: messages['status_change_update_error'],
	},
};
