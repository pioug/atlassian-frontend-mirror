/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { RichIconSearch } from '../../../../../common/ui/rich-icon/search';

import { CrystalBallSVGOld } from './assets/crystal-ball-svg-old';
import { initialStateViewMessages } from './messages';

const initialStateViewContainerStyles = css({
	display: 'flex',
	justifyContent: 'center',
	height: '100%',
});
const svgAndTextsWrapperStyles = css({
	textAlign: 'center',
	alignSelf: 'center',
});
const searchTitleStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.heading.small', fontFallback.heading.small),
	paddingTop: token('space.200', '16px'),
	paddingBottom: token('space.100', '8px'),
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
			<div css={svgAndTextsWrapperStyles}>
				{fg('bandicoots-update-sllv-icons') ? (
					<RichIconSearch size="xlarge" alt={formatMessage(initialStateViewMessages.searchTitle)} />
				) : (
					<CrystalBallSVGOld />
				)}
				<div css={searchTitleStyles}>{formatMessage(initialStateViewMessages.searchTitle)}</div>
				<div>{formatMessage(initialStateViewMessages.searchDescription)}</div>
				<a href={AQLSupportDocumentLink} target="_blank">
					{formatMessage(initialStateViewMessages.learnMoreLink)}
				</a>
			</div>
		</div>
	);
};
