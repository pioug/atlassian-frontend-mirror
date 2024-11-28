import React from 'react';

import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import {
	type InvokeClientActionHandler,
	type InvokeClientActionProps,
} from '../../state/hooks/use-invoke-client-action/types';

export const toAction = (
	action: InvokeClientActionProps,
	invokeClientAction: InvokeClientActionHandler,
	message: MessageDescriptor,
	id: string,
) => {
	return {
		id,
		text: <FormattedMessage {...message} />,
		invoke: () => invokeClientAction(action),
	};
};
