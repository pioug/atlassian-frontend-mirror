/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useRef, useCallback } from 'react';

import { css, jsx } from '@compiled/react';
import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl';

import AnalyticsContext from '@atlaskit/analytics-next/AnalyticsContext';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import Button from '@atlaskit/button/custom-theme-button/custom-theme-button';
import EditorCloseIcon from '@atlaskit/icon/core/cross';
import SearchIcon from '@atlaskit/icon/core/search';
import Spinner from '@atlaskit/spinner/spinner';
import Textfield from '@atlaskit/textfield/text-field';

import { messages } from '../../../messages';
import { REQUEST_STATE } from '../../../model/Requests';
import { VIEW } from '../../constants';
import { useNavigationContext } from '../../contexts/navigationContext';
import { useSearchContext } from '../../contexts/searchContext';
import {
	SearchInputContainer,
	SearchInputContainerAi,
	SearchIconContainer,
	CloseButtonAndSpinnerContainer,
} from './styled';

const ANALYTICS_CONTEXT_DATA = {
	componentName: 'searchInput',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};

const buttonStyles = css({
	width: '24px',
	height: '24px',
});

interface SearchInputProps extends WrappedComponentProps {
	isAiEnabled?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
	intl: { formatMessage },
	isAiEnabled = false,
}) => {
	const { view } = useNavigationContext();
	const { searchValue, searchState, onSearch, onSearchInputChanged, onSearchInputCleared } =
		useSearchContext();
	const inputRef = useRef<HTMLInputElement>(null);
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const handleOnInputChange = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>): void => {
			if (onSearch) {
				const value = (event.target as any).value;
				onSearch(value);
				if (onSearchInputChanged) {
					const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
						action: 'inputChanged',
						attributes: {
							value,
						},
					});
					onSearchInputChanged(event, analyticsEvent, value);
				}
			}
		},
		[createAnalyticsEvent, onSearch, onSearchInputChanged],
	);

	const handleOnKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleOnInputChange(event);
		}
	};

	const handleOnClearButtonClick = useCallback(
		(event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
			if (onSearch) {
				if (inputRef && inputRef.current) {
					inputRef.current.value = '';
					onSearch('');
				}

				if (onSearchInputCleared) {
					const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
						action: 'clicked',
					});
					onSearchInputCleared(event, analyticsEvent);
				}
			}
		},
		[createAnalyticsEvent, onSearch, onSearchInputCleared],
	);

	if (inputRef && inputRef.current) {
		inputRef.current.value = searchValue;
	}

	if (view === VIEW.ARTICLE || view === VIEW.WHATS_NEW_ARTICLE || view === VIEW.WHATS_NEW) {
		return null;
	}

	const WrapperComponent = isAiEnabled ? SearchInputContainerAi : SearchInputContainer;

	return (
		<WrapperComponent>
			<Textfield
				aria-label={formatMessage(messages.help_search_placeholder)}
				autoComplete="off"
				ref={inputRef}
				name="help-search-input"
				elemBeforeInput={
					<SearchIconContainer>
						<SearchIcon color="currentColor" spacing="spacious" label="" />
					</SearchIconContainer>
				}
				elemAfterInput={
					<CloseButtonAndSpinnerContainer>
						{searchState === REQUEST_STATE.loading && <Spinner size="small" />}
						{searchValue !== '' && (
							<Button
								css={buttonStyles}
								appearance="subtle"
								onClick={handleOnClearButtonClick}
								spacing="none"
								// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
								aria-label="Clear"
							>
								<EditorCloseIcon color="currentColor" spacing="spacious" label="" />
							</Button>
						)}
					</CloseButtonAndSpinnerContainer>
				}
				placeholder={formatMessage(messages.help_search_placeholder)}
				onChange={handleOnInputChange}
				onKeyPress={handleOnKeyPress}
				value={searchValue}
			/>
		</WrapperComponent>
	);
};

const SearchInputWithContext: React.FC<SearchInputProps> = (props) => {
	return (
		<AnalyticsContext data={ANALYTICS_CONTEXT_DATA}>
			<SearchInput {...props} />
		</AnalyticsContext>
	);
};

const _default_1: React.FC<WithIntlProps<SearchInputProps>> & {
	WrappedComponent: React.ComponentType<SearchInputProps>;
} = injectIntl(SearchInputWithContext);
export default _default_1;
