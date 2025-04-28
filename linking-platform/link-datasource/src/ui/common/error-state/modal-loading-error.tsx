/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { SpotErrorSearch } from '../../../common/ui/spot/error-state/search';

import { loadingErrorMessages } from './messages';

const styles = cssMap({
	errorContainerStyles: {
		display: 'grid',
		gap: token('space.300', '24px'),
		placeItems: 'center',
		placeSelf: 'center',
	},
	errorContainerStylesNew: {
		display: 'grid',
		gap: token('space.300', '24px'),
		placeItems: 'center',
		placeSelf: 'center',
		paddingTop: token('space.600', '48px'),
		paddingRight: token('space.600', '48px'),
		paddingBottom: token('space.600', '48px'),
		paddingLeft: token('space.600', '48px'),
		maxWidth: '400px',
	},
	errorMessageContainerStylesOld: {
		display: 'grid',
		gap: token('space.100', '8px'),
		placeItems: 'center',
	},
	errorMessageContainerStyles: {
		display: 'grid',
		gap: token('space.200', '16px'),
		placeItems: 'center',
		textAlign: 'center',
	},
});

interface ModalLoadingErrorProps {
	errorMessage?: React.ReactNode;
	/**
	 * This callback function is only consumed when the
	 * ff `platform-linking-visual-refresh-sllv` is enabled.
	 */
	onRefresh?: () => void;
}

export const ModalLoadingError = ({
	errorMessage = <FormattedMessage {...loadingErrorMessages.checkConnection} />,
	onRefresh,
}: ModalLoadingErrorProps) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	useEffect(() => {
		fireEvent('ui.error.shown', {
			reason: 'network',
		});
	}, [fireEvent]);

	return (
		<Box
			xcss={cx(
				fg('platform-linking-visual-refresh-sllv')
					? styles.errorContainerStylesNew
					: styles.errorContainerStyles,
			)}
			testId="datasource-modal--loading-error"
		>
			<SpotErrorSearch size={'xlarge'} alt="" />
			<Box
				xcss={cx(
					fg('platform-linking-visual-refresh-sllv')
						? styles.errorMessageContainerStyles
						: styles.errorMessageContainerStylesOld,
				)}
			>
				{fg('platform-linking-visual-refresh-sllv') ? (
					<Text as="span" size="large" weight="bold">
						<FormattedMessage {...loadingErrorMessages.unableToLoadResults} />
					</Text>
				) : (
					<Text size="small">
						<FormattedMessage {...loadingErrorMessages.unableToLoadResultsOld} />
					</Text>
				)}

				{fg('platform-linking-visual-refresh-sllv') ? (
					<Text as="span" size="medium">
						{errorMessage}
					</Text>
				) : (
					<Text as="p">{errorMessage}</Text>
				)}

				{onRefresh && fg('platform-linking-visual-refresh-sllv') && (
					<Button
						appearance="primary"
						onClick={onRefresh}
						testId="datasource-modal--loading-error-refresh"
					>
						<FormattedMessage {...loadingErrorMessages.refresh} />
					</Button>
				)}
			</Box>
		</Box>
	);
};
