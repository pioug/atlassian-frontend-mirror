import React from 'react';
import { type EditActionProps } from './types';
import Action from '../action';
import { messages } from '../../../../../messages';
import { FormattedMessage } from 'react-intl-next';
import EditIcon from '@atlaskit/icon/core/migration/edit';

const EditAction = (props: EditActionProps) => (
	<Action
		content={<FormattedMessage {...messages.edit} />}
		icon={<EditIcon color="currentColor" spacing="spacious" label="Edit" />}
		testId="smart-action-edit-action"
		tooltipMessage={<FormattedMessage {...messages.edit} />}
		{...props}
	/>
);

export default EditAction;
