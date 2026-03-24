import React from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl-next';
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
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			renderImage={() => <ErrorImage />}
			width="narrow"
			imageHeight={80}
			testId="config-panel-error-message"
		/>
	);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const _default_1: React.FC<WithIntlProps<Props>> & {
	WrappedComponent: React.ComponentType<Props>;
} = injectIntl(ConfigPanelErrorMessage);
export default _default_1;
