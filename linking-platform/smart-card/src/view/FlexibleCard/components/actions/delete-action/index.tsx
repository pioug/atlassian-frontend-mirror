import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import CrossIcon from '@atlaskit/icon/core/migration/cross';

import { messages } from '../../../../../messages';
import Action from '../action';

import { type DeleteActionProps } from './types';

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
