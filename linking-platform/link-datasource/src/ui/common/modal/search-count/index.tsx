import React from 'react';

import { FormattedMessage, FormattedNumber } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { Flex, xcss } from '@atlaskit/primitives';
import LinkUrl from '@atlaskit/smart-card/link-url';
import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { footerMessages } from '../../../table-footer/messages';

import { searchCountMessages } from './messages';

const searchCountStyles = xcss({
	flex: 1,
});

interface TableSearchCountProps {
	url?: string;
	prefixTextType: 'issue' | 'result' | 'item';
	searchCount: number;
	testId?: string;
}

const ItemCountWrapper = ({
	url,
	children,
	testId,
}: Pick<TableSearchCountProps, 'testId' | 'url'> & { children: React.ReactNode }) => (
	<Flex testId={testId} xcss={searchCountStyles} alignItems="center">
		<LinkUrl
			href={url}
			target="_blank"
			testId="item-count-url"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ color: token('color.text.accent.gray', N800), textDecoration: !url ? 'none' : '' }}
		>
			<Heading size="xxsmall">{children}</Heading>
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
	testId = 'datasource-table-total-results-count',
	prefixTextType = 'issue',
}: TableSearchCountProps) => {
	return (
		<ItemCountWrapper testId={testId} url={url}>
			<FormattedMessage
				{...searchCountMessages[`${prefixTextType}CountText`]}
				values={{ searchCount }}
			/>
		</ItemCountWrapper>
	);
};

export default TableSearchCount;
