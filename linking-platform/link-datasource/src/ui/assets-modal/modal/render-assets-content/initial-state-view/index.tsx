/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { RichIconSearch } from '../../../../../common/ui/rich-icon/search';

import { initialStateViewMessages } from './messages';

const initialStateViewContainerStyles = css({
	display: 'flex',
	justifyContent: 'center',
	height: '100%',
});
const svgAndTextsWrapperStylesOld = css({
	textAlign: 'center',
	alignSelf: 'center',
});
const svgAndTextsWrapperStyles = css({
	textAlign: 'center',
	alignSelf: 'center',
	paddingTop: token('space.600', '48px'),
	paddingBottom: token('space.600', '48px'),
	paddingLeft: token('space.600', '48px'),
	paddingRight: token('space.600', '48px'),
	maxWidth: '400px',
});
const searchTitleStylesOld = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.heading.small', fontFallback.heading.small),
	paddingTop: token('space.200', '16px'),
	paddingBottom: token('space.100', '8px'),
});
const searchTitleStyles = css({
	color: token('color.text'),
	font: token('font.heading.medium'),
	paddingTop: token('space.300', '24px'),
	paddingBottom: token('space.200', '16px'),
});

const mainTextStyles = css({
	color: token('color.text.subtle', '#44546F'),
});

const AQLSupportDocumentLink =
	'https://support.atlassian.com/jira-service-management-cloud/docs/use-assets-query-language-aql/';
export const InitialStateView = () => {
	const { formatMessage } = useIntl();
	return (
		<div
			css={initialStateViewContainerStyles}
			data-testid="assets-aql-datasource-modal--initial-state-view"
		>
			<div
				css={[
					fg('platform-linking-visual-refresh-sllv')
						? svgAndTextsWrapperStyles
						: svgAndTextsWrapperStylesOld,
				]}
			>
				<RichIconSearch
					size="xlarge"
					alt={formatMessage(
						fg('platform-linking-visual-refresh-sllv')
							? initialStateViewMessages.searchTitle
							: initialStateViewMessages.searchTitleOld,
					)}
				/>

				<div
					css={[
						fg('platform-linking-visual-refresh-sllv') ? searchTitleStyles : searchTitleStylesOld,
					]}
				>
					{formatMessage(
						fg('platform-linking-visual-refresh-sllv')
							? initialStateViewMessages.searchTitle
							: initialStateViewMessages.searchTitleOld,
					)}
				</div>
				<div css={[fg('platform-linking-visual-refresh-sllv') ? mainTextStyles : undefined]}>
					{formatMessage(initialStateViewMessages.searchDescription)}
				</div>
				{fg('platform-linking-visual-refresh-sllv') ? (
					<Link href={AQLSupportDocumentLink}>
						{formatMessage(initialStateViewMessages.learnMoreLink)}
					</Link>
				) : (
					<a href={AQLSupportDocumentLink} target="_blank">
						{formatMessage(initialStateViewMessages.learnMoreLinkOld)}
					</a>
				)}
			</div>
		</div>
	);
};
