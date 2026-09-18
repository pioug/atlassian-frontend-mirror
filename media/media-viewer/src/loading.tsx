import React from 'react';

import { useIntl } from 'react-intl';

import { messages } from '@atlaskit/media-ui/messages';
import AkSpinner from '@atlaskit/spinner/spinner';

export const Spinner = ({}: {}): React.JSX.Element => {
	const intl = useIntl();
	return (
		<AkSpinner label={intl.formatMessage(messages.loading_file)} appearance="invert" size="large" />
	);
};
