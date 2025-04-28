/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { fg } from '@atlaskit/platform-feature-flags';
import { Grid, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { SpotSearchNoResult } from '../../../common/ui/spot/error-state/search-no-result';

import { loadingErrorMessages } from './messages';

const styles = cssMap({
	noResultsContainerStylesOld: {
		marginTop: token('space.500'),
		marginRight: token('space.500'),
		marginBottom: token('space.500'),
		marginLeft: token('space.500'),
		gap: token('space.300'),
		placeItems: 'center',
		placeSelf: 'center',
	},
	noResultsContainerStyles: {
		marginTop: token('space.600'),
		marginRight: token('space.600'),
		marginBottom: token('space.600'),
		marginLeft: token('space.600'),
		placeItems: 'center',
		placeSelf: 'center',
	},
	noResultsContentStyles: {
		maxWidth: '304px',
		gap: token('space.300'),
		placeItems: 'center',
	},
	noResultsMessageContainerStylesOld: {
		gap: token('space.100'),
		placeItems: 'center',
	},
	noResultsMessageContainerStyles: {
		gap: token('space.200'),
		placeItems: 'center',
		textAlign: 'center',
	},
});

interface NoResultsProps {
	onRefresh?: () => void;
}

export const NoResults = ({ onRefresh }: NoResultsProps) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const { formatMessage } = useIntl();

	useEffect(() => {
		fireEvent('ui.emptyResult.shown.datasource', {});
	}, [fireEvent]);

	if (fg('platform-linking-visual-refresh-sllv')) {
		return (
			<Grid xcss={styles.noResultsContainerStyles} testId="datasource-modal--no-results">
				<Grid xcss={styles.noResultsContentStyles}>
					<SpotSearchNoResult
						size={'xlarge'}
						alt={formatMessage(loadingErrorMessages.noResultsFound)}
					/>
					<Grid xcss={styles.noResultsMessageContainerStyles}>
						<Text as="span" size="large" weight="bold">
							<FormattedMessage {...loadingErrorMessages.noResultsFound} />
						</Text>

						<Text as="span" size="medium">
							<FormattedMessage {...loadingErrorMessages.noResultsFoundDescription} />
						</Text>

						{onRefresh && (
							<Button appearance="primary" onClick={onRefresh}>
								<FormattedMessage {...loadingErrorMessages.refresh} />
							</Button>
						)}
					</Grid>
				</Grid>
			</Grid>
		);
	}

	return (
		<Grid xcss={styles.noResultsContainerStylesOld} testId="datasource-modal--no-results">
			<SpotSearchNoResult
				size={'xlarge'}
				alt={formatMessage(loadingErrorMessages.noResultsFoundOld)}
			/>
			<Grid xcss={styles.noResultsMessageContainerStylesOld}>
				<Text as="span" size="large" weight="bold">
					<FormattedMessage {...loadingErrorMessages.noResultsFoundOld} />
				</Text>

				{onRefresh && (
					<Button appearance="primary" onClick={onRefresh}>
						<FormattedMessage {...loadingErrorMessages.refresh} />
					</Button>
				)}
			</Grid>
		</Grid>
	);
};
