import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import EmptyState from '@atlaskit/empty-state';

import ErrorImage from './ErrorImage';

type Props = {
	errorMessage: string;
} & WrappedComponentProps;

const ConfigPanelErrorMessage = ({ errorMessage, intl }: Props) => {
	return (
		<EmptyState
			header={intl.formatMessage(messages.configFailedToLoad)}
			description={errorMessage}
			renderImage={() => <ErrorImage />}
			width="narrow"
			imageHeight={80}
			testId="config-panel-error-message"
		/>
	);
};

export default injectIntl(ConfigPanelErrorMessage);
