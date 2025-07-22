/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, cssMap, jsx } from '@compiled/react';
import { type MessageDescriptor, useIntl } from 'react-intl-next';

import { LoadingButton } from '@atlaskit/button';
import { IconButton } from '@atlaskit/button/new';
import SearchIcon from '@atlaskit/icon/core/migration/search--editor-search';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
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
	ariaLabel: MessageDescriptor;
}

const searchButtonStyles = css({
	marginRight: token('space.075', '6px'),
});

const styles = cssMap({
	searchButtonContainer: { marginRight: token('space.075', '6px') },
});

const formStyles = css({
	flex: 1,
});

const formWithMaxWidthStyles = css({
	flex: 1,
	maxWidth: 300,
});

export const BasicSearchInput = ({
	isDisabled,
	isSearching,
	onChange,
	onSearch,
	searchTerm,
	fullWidth,
	testId,
	ariaLabel,
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
		<form css={[fullWidth ? formStyles : formWithMaxWidthStyles]} onSubmit={handleFormSubmit}>
			<Textfield
				elemAfterInput={
					fg('replace-legacy-button-in-sllv') ? (
						<Box xcss={styles.searchButtonContainer}>
							<IconButton
								appearance="primary"
								isLoading={isSearching}
								icon={(iconProps) => (
									<SearchIcon
										{...iconProps}
										LEGACY_size="medium"
										spacing="spacious"
										color="currentColor"
									/>
								)}
								spacing="compact"
								type="submit"
								label={formatMessage(
									fg('confluence-issue-terminology-refresh')
										? basicSearchInputMessages.basicTextSearchLabelIssueTermRefresh
										: basicSearchInputMessages.basicTextSearchLabel,
								)}
								isDisabled={isDisabled}
								testId={`${testId}--basic-search-button`}
								onClick={handleSearchWithAnalytics}
							/>
						</Box>
					) : (
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
					)
				}
				autoFocus
				onChange={onChange}
				testId={`${testId}--basic-search-input`}
				value={searchTerm}
				aria-label={formatMessage(ariaLabel)}
			/>
		</form>
	);
};
