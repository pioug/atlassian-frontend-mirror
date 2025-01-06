import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';

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
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<strong>{formatMessage(messages.help_search_error)}</strong>
		</SearchResultEmptyMessageText>
		<SearchResultEmptyMessageText>
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<p>{formatMessage(messages.help_search_error_line_two)}</p>
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
