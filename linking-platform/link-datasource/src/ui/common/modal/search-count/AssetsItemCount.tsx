import React from 'react';

import { FormattedMessage, FormattedNumber } from 'react-intl';

import { footerMessages } from '../../../table-footer/messages';
import type { TableSearchCountProps } from './index';
import { ItemCountWrapper } from './ItemCountWrapper';

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
