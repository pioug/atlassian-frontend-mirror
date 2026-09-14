import React from 'react';

import { FormattedMessage } from 'react-intl';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { ItemCountWrapper } from './ItemCountWrapper';
import { searchCountMessages } from './messages';

export interface TableSearchCountProps {
	prefixTextType: 'issue' | 'result' | 'item';
	searchCount: number;
	styles?: React.CSSProperties;
	testId?: string;
	url?: string;
}

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
