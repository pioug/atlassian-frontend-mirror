import React from 'react';

import { FormattedMessage, FormattedNumber } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
import { Flex, xcss } from '@atlaskit/primitives';
import LinkUrl from '@atlaskit/smart-card/link-url';
import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { confluenceSearchModalMessages } from '../../../confluence-search-modal/modal/messages';
import { modalMessages } from '../../../jira-issues-modal/modal/messages';
import { footerMessages } from '../../../table-footer/messages';

import { searchCountMessages } from './messages';

const searchCountStyles = xcss({
	flex: 1,
});

export const AssetsItemCount = ({
	searchCount,
	url,
	testId,
}: {
	searchCount: number;
	url: string | undefined;
	testId: string;
}) => {
	let capCount = searchCount >= 1000;
	let displayCount = capCount ? 1000 : searchCount;
	let countModifier = capCount ? '+' : '';
	return (
		<Flex testId={testId} xcss={searchCountStyles} alignItems="center">
			<LinkUrl
				href={url}
				target="_blank"
				testId="item-count-url"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ color: token('color.text.accent.gray', N800), textDecoration: !url ? 'none' : '' }}
			>
				<Heading level="h200">
					<FormattedNumber value={displayCount} />
					{countModifier}{' '}
					<FormattedMessage {...footerMessages.itemText} values={{ itemCount: searchCount }} />
				</Heading>
			</LinkUrl>
		</Flex>
	);
};

interface TableSearchCountProps {
	url?: string;
	prefixTextType: 'issue' | 'result' | 'item';
	searchCount: number;
	testId?: string;
}

const TableSearchCount = ({
	url,
	searchCount,
	testId = 'datasource-table-total-results-count',
	prefixTextType = 'issue',
}: TableSearchCountProps) => {
	return (
		<Flex testId={testId} xcss={searchCountStyles} alignItems="center">
			<LinkUrl
				href={url}
				target="_blank"
				testId="item-count-url"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ color: token('color.text.accent.gray', N800), textDecoration: !url ? 'none' : '' }}
			>
				<Heading level="h200">
					{fg('platform.linking-platform.datasource.total-count-i18n-single-key') ? (
						<FormattedMessage
							{...searchCountMessages[`${prefixTextType}CountText`]}
							values={{ searchCount }}
						/>
					) : (
						<>
							<FormattedNumber value={searchCount} />{' '}
							{prefixTextType === 'issue' && (
								<FormattedMessage
									{...modalMessages.issueText}
									values={{ totalCount: searchCount }}
								/>
							)}
							{prefixTextType === 'result' && (
								<FormattedMessage
									{...confluenceSearchModalMessages.searchCountText}
									values={{ totalCount: searchCount }}
								/>
							)}
							{prefixTextType === 'item' && (
								<FormattedMessage
									{...footerMessages.itemText}
									values={{ itemCount: searchCount }}
								/>
							)}
						</>
					)}
				</Heading>
			</LinkUrl>
		</Flex>
	);
};

export default TableSearchCount;
