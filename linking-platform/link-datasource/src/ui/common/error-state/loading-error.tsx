/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useEffect } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import AKLink from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { SpotErrorSearch } from '../../../common/ui/spot/error-state/search';

import { loadingErrorMessages } from './messages';

const styles = cssMap({
	errorContainerStylesOld: {
		display: 'grid',
		gap: token('space.200', '16px'),
		placeItems: 'center',
		placeSelf: 'center',
	},
	// TODO Rename errorContainerStylesNew to errorContainerStyles when cleaning platform-linking-visual-refresh-sllv
	errorContainerStylesNew: {
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
	if (fg('platform-linking-visual-refresh-sllv')) {
		if (url && isConfluenceSearch(url)) {
			connectionErrorMessage = loadingErrorMessages.checkConnectionConfluence;
		}
		if (url && isJiraIssuesList(url)) {
			connectionErrorMessage = loadingErrorMessages.checkConnectionJira;
		}
	}

	// TODO: Move it to inline when cleaning platform-linking-visual-refresh-sllv
	const FGWrapper = fg('platform-linking-visual-refresh-sllv') ? 'div' : Fragment;

	return (
		<FGWrapper
			{...(fg('platform-linking-visual-refresh-sllv') && {
				contentEditable: false,
			})}
		>
			<Box
				xcss={
					fg('platform-linking-visual-refresh-sllv')
						? styles.errorContainerStylesNew
						: styles.errorContainerStylesOld
				}
				testId="datasource--loading-error"
			>
				<SpotErrorSearch size={'xlarge'} alt="" />
				<Box xcss={styles.errorMessageContainerStyles}>
					<Inline as="span" xcss={styles.errorMessageStyles}>
						{fg('platform-linking-visual-refresh-sllv') ? (
							<FormattedMessage {...loadingErrorMessages.unableToLoadResultsVisualRefreshSllv} />
						) : (
							<FormattedMessage {...loadingErrorMessages.unableToLoadItemsOld} />
						)}
					</Inline>
					<Text as="p">
						<FormattedMessage
							{...connectionErrorMessage}
							{...(fg('platform-linking-visual-refresh-sllv') && {
								values: {
									a: (chunks: React.ReactNode) => (
										<AKLink href={url || ''} target="blank">
											{chunks}
										</AKLink>
									),
								},
							})}
						/>
					</Text>
					{onRefresh && (
						<Button appearance="primary" onClick={onRefresh}>
							<FormattedMessage {...loadingErrorMessages.refresh} />
						</Button>
					)}
				</Box>
			</Box>
		</FGWrapper>
	);
};
