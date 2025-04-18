import React from 'react';
import Button from '@atlaskit/button';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { type WHATS_NEW_ITEM_TYPES } from '../../../../model/WhatsNew';

import ErrorImage from '../../../../assets/ErrorImage';
import { messages } from '../../../../messages';
import { Text } from '@atlaskit/primitives/compiled';

import { SearchResultEmptyMessageImage, SearchResultEmptyMessageText } from './styled';

export interface Props {
	onSearch?(
		filter?: WHATS_NEW_ITEM_TYPES | '',
		numberOfItems?: number,
		page?: string,
	): Promise<void>;
}

export const WhatsNewResultsError: React.FC<Props & WrappedComponentProps> = ({
	onSearch,
	intl: { formatMessage },
}) => (
	<>
		<SearchResultEmptyMessageImage>
			<ErrorImage />
		</SearchResultEmptyMessageImage>

		<SearchResultEmptyMessageText>
			<Text as="strong">{formatMessage(messages.help_search_error)}</Text>
		</SearchResultEmptyMessageText>
		<SearchResultEmptyMessageText>
			<Text as="p">{formatMessage(messages.help_search_error_line_two)}</Text>
		</SearchResultEmptyMessageText>
		<SearchResultEmptyMessageText>
			{onSearch && (
				<Button onClick={() => onSearch('')} appearance="primary">
					{formatMessage(messages.help_search_error_button_label)}
				</Button>
			)}
		</SearchResultEmptyMessageText>
	</>
);

export default injectIntl(WhatsNewResultsError);
