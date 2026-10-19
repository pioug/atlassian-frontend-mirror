import React from 'react';

import { useIntl } from 'react-intl';

import { messages } from '@atlaskit/media-ui/messages';
import AkSpinner from '@atlaskit/spinner/spinner';

import { useIsInsetViewer } from './insetViewerContext';

export const Spinner = ({}: {}): React.JSX.Element => {
	const intl = useIntl();
	const isInsetViewer = useIsInsetViewer();
	return (
		<AkSpinner
			label={intl.formatMessage(messages.loading_file)}
			// The overlay viewer is always dark, so it inverts the spinner. The inset viewer follows the
			// theme, so it uses the spinner's own subtle icon colour.
			appearance={isInsetViewer ? 'inherit' : 'invert'}
			size="large"
		/>
	);
};
