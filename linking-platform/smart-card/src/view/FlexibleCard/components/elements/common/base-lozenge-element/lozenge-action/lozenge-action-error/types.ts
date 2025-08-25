import { messages } from '../../../../../../../../messages';
import { type InvokeClientActionProps } from '../../../../../../../../state/hooks/use-invoke-client-action/types';
import { type MessageProps } from '../../../../../types';

export type LozengeActionErrorProps = {
	/**
	 * Error message to be displayed inside the dropdown
	 */
	errorMessage: string | MessageProps;

	/**
	 * A preview link action to invoke with useInvokeClientAction
	 */
	invokePreviewAction?: InvokeClientActionProps;

	/**
	 * Maximum number of lines displayed inside of the dropdown
	 */
	maxLineNumber?: number;

	/**
	 * Data test id used for testing purposes
	 */
	testId?: string;

	/**
	 * The url of the link. Used in reload functionality
	 */
	url?: string;
};

export const LozengeActionErrorMessages = {
	noData: {
		descriptor: messages['status_change_permission_error'],
	},
	noDataIssueTermRefresh: {
		descriptor: messages['status_change_permission_errorIssueTermRefresh'],
	},
	unknown: {
		descriptor: messages['status_change_load_error'],
	},
	updateFailed: {
		descriptor: messages['status_change_update_error'],
	},
};
