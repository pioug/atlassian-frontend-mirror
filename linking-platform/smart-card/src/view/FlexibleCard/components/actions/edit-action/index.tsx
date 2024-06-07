import React, { type FC } from 'react';
import { type EditActionProps } from './types';
import Action from '../action';
import { messages } from '../../../../../messages';
import { FormattedMessage } from 'react-intl-next';
import EditIcon from '@atlaskit/icon/glyph/edit';

const EditAction: FC<EditActionProps> = (props) => (
	<Action
		content={<FormattedMessage {...messages.edit} />}
		icon={<EditIcon label="Edit" />}
		testId="smart-action-edit-action"
		tooltipMessage={<FormattedMessage {...messages.edit} />}
		{...props}
	/>
);

export default EditAction;
