/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { type MessageDescriptor, useIntl } from 'react-intl-next';

import { LoadingButton } from '@atlaskit/button';
import SearchIcon from '@atlaskit/icon/core/migration/search--editor-search';
import { fg } from '@atlaskit/platform-feature-flags';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../../analytics';

import { basicSearchInputMessages } from './messages';

export interface BasicSearchInputProps {
	isDisabled?: boolean;
	isSearching?: boolean;
	onChange: React.FormEventHandler<HTMLInputElement>;
	onSearch: (searchTerm: string) => void;
	searchTerm: string;
	fullWidth?: boolean;
	testId: string;
	placeholder: MessageDescriptor;
}

const searchButtonStyles = css({
	marginRight: token('space.075', '6px'),
});

const formStyles = css({
	flex: 1,
});

const formWithMaxWidthStyles = css({
	flex: 1,
	maxWidth: 250,
});

export const BasicSearchInputOld = ({
	isDisabled,
	isSearching,
	onChange,
	onSearch,
	searchTerm,
	fullWidth,
	testId,
	placeholder,
}: BasicSearchInputProps) => {
	const { formatMessage } = useIntl();
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const handleSearchWithAnalytics = () => {
		fireEvent('ui.form.submitted.basicSearch', {});
		onSearch(searchTerm);
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleSearchWithAnalytics();
	};

	return (
		<form css={fullWidth ? formStyles : formWithMaxWidthStyles} onSubmit={handleFormSubmit}>
			<Textfield
				elemAfterInput={
					<LoadingButton
						appearance="primary"
						css={searchButtonStyles}
						iconBefore={
							<SearchIcon
								label={formatMessage(
									fg('confluence-issue-terminology-refresh')
										? basicSearchInputMessages.basicTextSearchLabelIssueTermRefresh
										: basicSearchInputMessages.basicTextSearchLabel,
								)}
								LEGACY_size="medium"
								color="currentColor"
								spacing="spacious"
							/>
						}
						isDisabled={isDisabled}
						isLoading={isSearching}
						onClick={handleSearchWithAnalytics}
						spacing="none"
						testId={`${testId}--basic-search-button`}
					/>
				}
				autoFocus
				onChange={onChange}
				placeholder={formatMessage(placeholder)}
				testId={`${testId}--basic-search-input`}
				value={searchTerm}
			/>
		</form>
	);
};
