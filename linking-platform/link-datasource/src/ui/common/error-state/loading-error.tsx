/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { FormattedList, FormattedMessage } from 'react-intl';

import Button from '@atlaskit/button/standard-button';
import AKLink from '@atlaskit/link/link';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { SpotErrorSearch } from '../../../common/ui/spot/error-state/search';
import { loadingErrorMessages, missingColumnsMessages } from './messages';

const styles = cssMap({
	errorContainerStyles: {
		display: 'grid',
		gap: token('space.200'),
		placeItems: 'center',
		marginInline: 'auto',
		maxWidth: '400px',
		textAlign: 'center',
		paddingInline: token('space.600'),
		paddingBlock: token('space.600'),
	},
	errorMessageContainerStyles: {
		display: 'grid',
		gap: token('space.100'),
		placeItems: 'center',
	},
	errorMessageStyles: {
		font: token('font.heading.small'),
	},
});

interface LoadingErrorProps {
	errorType?: 'network' | 'missing-columns';
	onRefresh?: () => void;
	unavailableColumnKeys?: string[];
	url?: string;
}

const isConfluenceSearch = (url: string) => !!url.match(/https:\/\/.*\/wiki\/search/);

const isJiraIssuesList = (url: string) => !!url.match(/https:\/\/.*\/issues\/?\?jql=/);

export const LoadingError = ({
	onRefresh,
	url,
	errorType = 'network',
	unavailableColumnKeys = [],
}: LoadingErrorProps): JSX.Element => {
	const { fireEvent } = useDatasourceAnalyticsEvents();
	const effectiveErrorType = fg('platform_datasource_missing_columns_error')
		? errorType
		: 'network';

	useEffect(() => {
		if (effectiveErrorType !== 'missing-columns') {
			fireEvent('ui.error.shown', {
				reason: 'network',
			});
		}
	}, [fireEvent, effectiveErrorType]);

	let title = loadingErrorMessages.unableToLoadResults;
	let description = loadingErrorMessages.checkConnection;

	switch (effectiveErrorType) {
		case 'missing-columns':
			title = missingColumnsMessages.missingColumnsTitle;
			description = unavailableColumnKeys.length
				? missingColumnsMessages.missingColumnsDescriptionWithNames
				: missingColumnsMessages.missingColumnsDescription;
			break;
		case 'network':
		default:
			if (url && isConfluenceSearch(url)) {
				description = loadingErrorMessages.checkConnectionConfluence;
			}
			if (url && isJiraIssuesList(url)) {
				description = loadingErrorMessages.checkConnectionJira;
			}
			break;
	}

	return (
		<div contentEditable={false}>
			<Box xcss={styles.errorContainerStyles} testId="datasource--loading-error">
				<SpotErrorSearch size={'xlarge'} alt="" />
				<Box xcss={styles.errorMessageContainerStyles}>
					<Inline as="span" xcss={styles.errorMessageStyles}>
						<FormattedMessage {...title} />
					</Inline>
					<Text as="p">
						<FormattedMessage
							{...description}
							values={{
								...(effectiveErrorType === 'missing-columns'
									? { columns: <FormattedList value={unavailableColumnKeys} /> }
									: {}),
								a: (chunks: React.ReactNode) => (
									<AKLink href={url || ''} target="blank">
										{chunks}
									</AKLink>
								),
							}}
						/>
					</Text>
					{effectiveErrorType !== 'missing-columns' && onRefresh && (
						<Button appearance="primary" onClick={onRefresh}>
							<FormattedMessage {...loadingErrorMessages.refresh} />
						</Button>
					)}
				</Box>
			</Box>
		</div>
	);
};
