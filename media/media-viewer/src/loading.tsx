import React from 'react';
import AkSpinner from '@atlaskit/spinner/spinner';
import { messages } from '@atlaskit/media-ui/messages';
import { useIntl } from 'react-intl';

export const Spinner = ({}: {}): React.JSX.Element => {
	const intl = useIntl();
	return (
		<AkSpinner label={intl.formatMessage(messages.loading_file)} appearance="invert" size="large" />
	);
};
