/** @jsx jsx */

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { CrystalBallSVG } from './assets/crystal-ball-svg';
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
				<CrystalBallSVG />
				<div css={searchTitleStyles}>{formatMessage(initialStateViewMessages.searchTitle)}</div>
				<div>{formatMessage(initialStateViewMessages.searchDescription)}</div>
				<a href={AQLSupportDocumentLink} target="_blank">
					{formatMessage(initialStateViewMessages.learnMoreLink)}
				</a>
			</div>
		</div>
	);
};
