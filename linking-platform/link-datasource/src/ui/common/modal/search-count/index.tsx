import React from 'react';

import { cssMap } from '@compiled/react';
import { FormattedMessage, FormattedNumber } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { Flex } from '@atlaskit/primitives/compiled';
import LinkUrl from '@atlaskit/smart-card/link-url';
import { token } from '@atlaskit/tokens';

import { footerMessages } from '../../../table-footer/messages';

import { searchCountMessages } from './messages';

const styles = cssMap({
	searchCountStyles: {
		flex: 1,
	},
});

interface TableSearchCountProps {
	prefixTextType: 'issue' | 'result' | 'item';
	searchCount: number;
	styles?: React.CSSProperties;
	testId?: string;
	url?: string;
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
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				color: token('color.text.subtlest'),
				textDecoration: !url ? 'none' : '',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				...additionalStyles,
			}}
		>
			{children}
		</LinkUrl>
	</Flex>
);

export const AssetsItemCount = ({
	searchCount,
	url,
	testId,
}: Pick<TableSearchCountProps, 'testId' | 'url' | 'searchCount'>): React.JSX.Element => {
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
}: TableSearchCountProps): React.JSX.Element => {
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
