import React from 'react';

import { defineMessages, type MessageDescriptor, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';

import type { LinkPickerState, LinkSearchListItemData } from '../../../../common/types';

import { checkSubmitDisabled } from './utils';

type LinkPickerButtonGroupProps = {
	isEditing?: boolean;
	isLoading: boolean;
	isSubmitting: boolean;
	customSubmitButtonLabel?: MessageDescriptor;
	error: unknown | null;
	items: LinkSearchListItemData[] | null;
	queryState: LinkPickerState | null;
	submitMessageId?: string;
	testId?: string;
	url: string;
};

export const messages = defineMessages({
	saveButton: {
		id: 'fabric.linkPicker.button.save',
		defaultMessage: 'Save',
		description: 'Button to save edited link',
	},
	insertButton: {
		id: 'fabric.linkPicker.button.insert',
		defaultMessage: 'Insert',
		description: 'Button to insert searched or selected link',
	},
});

export const LinkPickerSubmitButton = ({
	isEditing,
	isLoading,
	isSubmitting,
	customSubmitButtonLabel,
	error,
	items,
	queryState,
	submitMessageId,
	testId,
	url,
}: LinkPickerButtonGroupProps): React.JSX.Element => {
	const intl = useIntl();
	const insertButtonMsg = isEditing ? messages.saveButton : messages.insertButton;

	const isSubmitDisabled = checkSubmitDisabled(
		isLoading,
		isSubmitting,
		error,
		url,
		queryState,
		items,
	);

	return (
		<Button
			type="submit"
			appearance="primary"
			testId={testId}
			isDisabled={isSubmitDisabled}
			aria-labelledby={isSubmitting ? submitMessageId : undefined}
			isLoading={isSubmitting}
		>
			{customSubmitButtonLabel
				? intl.formatMessage(customSubmitButtonLabel)
				: intl.formatMessage(insertButtonMsg)}
		</Button>
	);
};
