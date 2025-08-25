import { type MessageDescriptor } from 'react-intl-next';

import type { Props as SmartUserPickerProps } from '@atlaskit/smart-user-picker';
export type UserPickerOptions = Pick<
	SmartUserPickerProps,
	'onFocus' | 'header' | 'includeNonLicensedUsers'
> & {
	/**
	 * Label message for the user picker.
	 */
	getLabelMessage?: (allowEmail?: boolean, isBrowseUsersDisabled?: boolean) => MessageDescriptor;

	/**
	 * Placeholder message for the user picker.
	 */
	getPlaceholderMessage?: (
		allowEmail?: boolean,
		isBrowseUsersDisabled?: boolean,
	) => MessageDescriptor;
	/**
	 * Message to be shown when required validation is shown in the user picker.
	 */
	getRequiredMessage?: (allowEmail?: boolean, isBrowseUsersDisabled?: boolean) => MessageDescriptor;
	/** Message to be shown when the menu is open but no options are provided.
	 * If message is null, no message will be displayed.
	 * If message is undefined, default message will be displayed.
	 */
	noOptionsMessageHandler?:
		| ((value: {
				allowEmail?: boolean;
				inputValue: string;
				isPublicLink?: boolean;
		  }) => string | null | React.ReactNode)
		| null;
};
