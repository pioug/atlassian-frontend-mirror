import React from 'react';
import { type EditActionProps } from './types';
import Action from '../action';
import { messages } from '../../../../../messages';
import { FormattedMessage } from 'react-intl-next';
import EditIcon from '@atlaskit/icon/glyph/edit';

const EditAction = (props: EditActionProps) => (
	<Action
		content={<FormattedMessage {...messages.edit} />}
		// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19716
		icon={<EditIcon label="Edit" />}
		testId="smart-action-edit-action"
		tooltipMessage={<FormattedMessage {...messages.edit} />}
		{...props}
	/>
);

export default EditAction;
