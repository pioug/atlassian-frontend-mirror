/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import AKLink from '@atlaskit/link';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { SpotErrorSearch } from '../../../common/ui/spot/error-state/search';

import { loadingErrorMessages } from './messages';

const styles = cssMap({
	errorContainerStyles: {
		display: 'grid',
		gap: token('space.200', '16px'),
		placeItems: 'center',
		marginInline: 'auto',
		maxWidth: '400px',
		textAlign: 'center',
		paddingInline: token('space.600'),
		paddingBlock: token('space.600'),
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
	url?: string;
}

const isConfluenceSearch = (url: string) => !!url.match(/https:\/\/.*\/wiki\/search/);

const isJiraIssuesList = (url: string) => !!url.match(/https:\/\/.*\/issues\/?\?jql=/);

export const LoadingError = ({ onRefresh, url }: LoadingErrorProps) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	useEffect(() => {
		fireEvent('ui.error.shown', {
			reason: 'network',
		});
	}, [fireEvent]);

	let connectionErrorMessage = loadingErrorMessages.checkConnection;
	if (url && isConfluenceSearch(url)) {
		connectionErrorMessage = loadingErrorMessages.checkConnectionConfluence;
	}
	if (url && isJiraIssuesList(url)) {
		connectionErrorMessage = loadingErrorMessages.checkConnectionJira;
	}

	return (
		<div contentEditable={false}>
			<Box xcss={styles.errorContainerStyles} testId="datasource--loading-error">
				<SpotErrorSearch size={'xlarge'} alt="" />
				<Box xcss={styles.errorMessageContainerStyles}>
					<Inline as="span" xcss={styles.errorMessageStyles}>
						<FormattedMessage {...loadingErrorMessages.unableToLoadResults} />
					</Inline>
					<Text as="p">
						<FormattedMessage
							{...connectionErrorMessage}
							values={{
								a: (chunks: React.ReactNode) => (
									<AKLink href={url || ''} target="blank">
										{chunks}
									</AKLink>
								),
							}}
						/>
					</Text>
					{onRefresh && (
						<Button appearance="primary" onClick={onRefresh}>
							<FormattedMessage {...loadingErrorMessages.refresh} />
						</Button>
					)}
				</Box>
			</Box>
		</div>
	);
};
