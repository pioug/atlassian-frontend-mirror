import React from 'react';

import { cssMap } from '@compiled/react';
import { FormattedMessage, FormattedNumber } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
import { Flex } from '@atlaskit/primitives/compiled';
import LinkUrl from '@atlaskit/smart-card/link-url';
import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { footerMessages } from '../../../table-footer/messages';

import { searchCountMessages } from './messages';

const styles = cssMap({
	searchCountStyles: {
		flex: 1,
	},
});

interface TableSearchCountProps {
	url?: string;
	prefixTextType: 'issue' | 'result' | 'item';
	searchCount: number;
	testId?: string;
	/**
	 * This attribute is only consumed when the fg
	 * `platform-linking-visual-refresh-sllv` is enabled.
	 */
	styles?: React.CSSProperties;
}

const ItemCountWrapper = ({
	url,
	styles: additionalStyles,
	children,
	testId,
}: Pick<TableSearchCountProps, 'testId' | 'url' | 'styles'> & { children: React.ReactNode }) => (
	<Flex testId={testId} xcss={styles.searchCountStyles} alignItems="center">
		<LinkUrl
			href={url}
			target="_blank"
			testId="item-count-url"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{
				color: fg('platform-linking-visual-refresh-sllv')
					? token('color.text.subtlest')
					: token('color.text.accent.gray', N800),
				textDecoration: !url ? 'none' : '',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				...(fg('platform-linking-visual-refresh-sllv') && additionalStyles),
			}}
		>
			{fg('platform-linking-visual-refresh-sllv') ? (
				children
			) : (
				<Heading size="xxsmall">{children}</Heading>
			)}
		</LinkUrl>
	</Flex>
);

export const AssetsItemCount = ({
	searchCount,
	url,
	testId,
}: Pick<TableSearchCountProps, 'testId' | 'url' | 'searchCount'>) => {
	let capCount = searchCount >= 1000;
	let displayCount = capCount ? 1000 : searchCount;
	let countModifier = capCount ? '+' : '';
	return (
		<ItemCountWrapper testId={testId} url={url}>
			<FormattedNumber value={displayCount} />
			{countModifier}{' '}
			<FormattedMessage {...footerMessages.itemText} values={{ itemCount: searchCount }} />
		</ItemCountWrapper>
	);
};

const TableSearchCount = ({
	url,
	searchCount,
	styles: additionalStyles,
	testId = 'datasource-table-total-results-count',
	prefixTextType = 'issue',
}: TableSearchCountProps) => {
	const isIssue = prefixTextType === 'issue';
	const messageKey: keyof typeof searchCountMessages =
		isIssue && fg('confluence-issue-terminology-refresh')
			? 'issueCountTextIssueTermRefresh'
			: (`${prefixTextType}CountText` as keyof typeof searchCountMessages);
	return (
		<ItemCountWrapper testId={testId} url={url} styles={additionalStyles}>
			<FormattedMessage {...searchCountMessages[messageKey]} values={{ searchCount }} />
		</ItemCountWrapper>
	);
};

export default TableSearchCount;
