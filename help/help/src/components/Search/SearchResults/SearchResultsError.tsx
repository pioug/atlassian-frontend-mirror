import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { Text } from '@atlaskit/primitives/compiled';

import ErrorImage from '../../../assets/ErrorImage';
import { messages } from '../../../messages';

import { SearchResultEmptyMessageImage, SearchResultEmptyMessageText } from './styled';

export interface Props {
	onSearch?(value?: string): void;
}

export const SearchResultsError: React.FC<Props & WrappedComponentProps> = ({
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
		{onSearch && (
			<SearchResultEmptyMessageText>
				<Button onClick={() => onSearch()} appearance="primary">
					{formatMessage(messages.help_search_error_button_label)}
				</Button>
			</SearchResultEmptyMessageText>
		)}
	</>
);

export default injectIntl(SearchResultsError);
