/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { SpotErrorSearch } from '../../../common/ui/spot/error-state/search';

import { LoadingErrorSVGOld } from './loading-error-svg-old';
import { loadingErrorMessages } from './messages';

const styles = cssMap({
	errorContainerStyles: {
		display: 'grid',
		gap: token('space.200', '16px'),
		placeItems: 'center',
		placeSelf: 'center',
	},
	errorMessageContainerStyles: {
		display: 'grid',
		gap: token('space.100', '8px'),
		placeItems: 'center',
	},
	errorMessageStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		font: token('font.heading.small', fontFallback.heading.small),
	},
});

interface LoadingErrorProps {
	onRefresh?: () => void;
}

export const LoadingError = ({ onRefresh }: LoadingErrorProps) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	useEffect(() => {
		fireEvent('ui.error.shown', {
			reason: 'network',
		});
	}, [fireEvent]);

	return (
		<Box xcss={styles.errorContainerStyles} testId="datasource--loading-error">
			{fg('bandicoots-update-sllv-icons') ? (
				<SpotErrorSearch size={'xlarge'} alt="" />
			) : (
				<LoadingErrorSVGOld />
			)}
			<Box xcss={styles.errorMessageContainerStyles}>
				<Inline as="span" xcss={styles.errorMessageStyles}>
					<FormattedMessage {...loadingErrorMessages.unableToLoadItems} />
				</Inline>
				<Text as="p">
					<FormattedMessage {...loadingErrorMessages.checkConnection} />
				</Text>
				{onRefresh && (
					<Button appearance="primary" onClick={onRefresh}>
						<FormattedMessage {...loadingErrorMessages.refresh} />
					</Button>
				)}
			</Box>
		</Box>
	);
};
