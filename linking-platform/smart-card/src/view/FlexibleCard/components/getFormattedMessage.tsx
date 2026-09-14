import React from 'react';

import { FormattedMessage } from 'react-intl';

import { type MessageProps } from './types';

export const getFormattedMessage = (message?: MessageProps): React.JSX.Element | undefined => {
	if (message) {
		const { descriptor, values } = message;
		return <FormattedMessage {...descriptor} values={values} />;
	}
};
