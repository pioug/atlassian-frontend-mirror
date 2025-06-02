import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { Field, useFormState } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';

import { messages } from '../i18n';
import { type Comment, type ShareData } from '../types';

export type Props = {
	defaultValue?: Comment;
	isExtendedShareDialogEnabled?: boolean;
};

export const CommentField: React.FunctionComponent<Props> = ({
	defaultValue,
	isExtendedShareDialogEnabled,
}) => {
	const intl = useIntl();

	const formData = useFormState<ShareData>();

	const shouldShowCommentField = useMemo(
		() =>
			!isExtendedShareDialogEnabled ||
			(formData?.values.users && formData?.values.users.length > 0),
		[formData?.values.users, isExtendedShareDialogEnabled],
	);

	if (!shouldShowCommentField) {
		return null;
	}

	return (
		<Field<Comment>
			name="comment"
			defaultValue={defaultValue}
			label={intl.formatMessage(
				isExtendedShareDialogEnabled ? messages.extendedDialogCommentLabel : messages.commentLabel,
			)}
		>
			{({ fieldProps }) => (
				<TextArea
					{...fieldProps}
					onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
						fieldProps.onChange({
							format: 'plain_text',
							value: event.target.value,
						})
					}
					value={fieldProps.value && fieldProps.value.value}
					maxLength={500}
					minimumRows={3}
					placeholder={intl.formatMessage(messages.commentPlaceholder)}
				/>
			)}
		</Field>
	);
};
