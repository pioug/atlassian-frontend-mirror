import React from 'react';

import { useIntl } from 'react-intl-next';

import { Field } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';

import { messages } from '../i18n';
import { type Comment } from '../types';

export type Props = {
	defaultValue?: Comment;
};

export const CommentField: React.FunctionComponent<Props> = ({ defaultValue }) => {
	const intl = useIntl();
	return (
		<Field<Comment>
			name="comment"
			defaultValue={defaultValue}
			label={intl.formatMessage(messages.commentLabel)}
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
