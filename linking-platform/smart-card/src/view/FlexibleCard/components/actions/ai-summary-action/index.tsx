import React from 'react';

import { InternalActionName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';

import { AISummaryActionComponent } from './ai-summary-action-component';
import type { AISummaryActionProps } from './types';

const AISummaryAction = (props: AISummaryActionProps): React.JSX.Element | null => {
	const context = useFlexibleUiContext();

	const actionData = context?.actions?.[InternalActionName.AISummaryAction];

	return actionData ? <AISummaryActionComponent {...actionData} {...props} /> : null;
};

export default AISummaryAction;
