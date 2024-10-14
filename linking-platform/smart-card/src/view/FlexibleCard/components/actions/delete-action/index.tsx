import React from 'react';
import { type DeleteActionProps } from './types';
import Action from '../action';
import { messages } from '../../../../../messages';
import { FormattedMessage } from 'react-intl-next';
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';

const DeleteAction = (props: DeleteActionProps) => (
	<Action
		content={<FormattedMessage {...messages.delete} />}
		icon={<CrossIcon color="currentColor" spacing="spacious" label="Delete" />}
		testId="smart-action-delete-action"
		tooltipMessage={<FormattedMessage {...messages.delete} />}
		{...props}
	/>
);

export default DeleteAction;
