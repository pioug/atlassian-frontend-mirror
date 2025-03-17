/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { SpotErrorSearch } from '../../../common/ui/spot/error-state/search';

import { LoadingErrorSVGOld } from './loading-error-svg-old';
import { loadingErrorMessages } from './messages';

const styles = cssMap({
	errorContainerStyles: {
		display: 'grid',
		gap: token('space.300', '24px'),
		placeItems: 'center',
		placeSelf: 'center',
	},
	errorMessageContainerStyles: {
		display: 'grid',
		gap: token('space.100', '8px'),
		placeItems: 'center',
	},
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
		<Box xcss={styles.errorContainerStyles} testId="datasource-modal--loading-error">
			{fg('bandicoots-update-sllv-icons') ? (
				<SpotErrorSearch size={'xlarge'} alt="" />
			) : (
				<LoadingErrorSVGOld />
			)}
			<Box xcss={styles.errorMessageContainerStyles}>
				<Text size="small">
					<FormattedMessage {...loadingErrorMessages.unableToLoadResults} />
				</Text>
				<Text as="p">{errorMessage}</Text>
			</Box>
		</Box>
	);
};
