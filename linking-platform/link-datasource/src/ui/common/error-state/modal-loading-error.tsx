/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { Box, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';

import { LoadingErrorSVG } from './loading-error-svg';
import { loadingErrorMessages } from './messages';

const errorContainerStyles = css({
	display: 'grid',
	gap: token('space.300', '24px'),
	placeItems: 'center',
	placeSelf: 'center',
});

const errorMessageContainerStyles = css({
	display: 'grid',
	gap: token('space.100', '8px'),
	placeItems: 'center',
});

interface ModalLoadingErrorProps {
	errorMessage?: React.ReactNode;
}

export const ModalLoadingError = ({
	errorMessage = <FormattedMessage {...loadingErrorMessages.checkConnection} />,
}: ModalLoadingErrorProps) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	useEffect(() => {
		fireEvent('ui.error.shown', {
			reason: 'network',
		});
	}, [fireEvent]);

	return (
		<Box xcss={errorContainerStyles} testId="datasource-modal--loading-error">
			<LoadingErrorSVG />
			<Box xcss={errorMessageContainerStyles}>
				<Text size="small">
					<FormattedMessage {...loadingErrorMessages.unableToLoadResults} />
				</Text>
				<Text as="p">{errorMessage}</Text>
			</Box>
		</Box>
	);
};
