/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import Link from '@atlaskit/link';
import { token } from '@atlaskit/tokens';

import { RichIconSearch } from '../../../../../common/ui/rich-icon/search';

import { initialStateViewMessages } from './messages';

const initialStateViewContainerStyles = css({
	display: 'flex',
	justifyContent: 'center',
	height: '100%',
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
			<div css={[svgAndTextsWrapperStyles]}>
				<RichIconSearch size="xlarge" alt={formatMessage(initialStateViewMessages.searchTitle)} />

				<div css={[searchTitleStyles]}>{formatMessage(initialStateViewMessages.searchTitle)}</div>
				<div css={[mainTextStyles]}>
					{formatMessage(initialStateViewMessages.searchDescription)}
				</div>
				<Link href={AQLSupportDocumentLink}>
					{formatMessage(initialStateViewMessages.learnMoreLink)}
				</Link>
			</div>
		</div>
	);
};
