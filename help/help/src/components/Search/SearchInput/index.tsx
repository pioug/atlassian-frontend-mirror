/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useRef, useCallback } from 'react';
import {
	useAnalyticsEvents,
	type UIAnalyticsEvent,
	AnalyticsContext,
} from '@atlaskit/analytics-next';
import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button/custom-theme-button';
import { gridSize } from '@atlaskit/theme/constants';
import Spinner from '@atlaskit/spinner';
import SearchIcon from '@atlaskit/icon/core/migration/search';
import EditorCloseIcon from '@atlaskit/icon/core/migration/close--editor-close';
import { css, jsx } from '@compiled/react';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';

import { REQUEST_STATE } from '../../../model/Requests';
import { useSearchContext } from '../../contexts/searchContext';
import { messages } from '../../../messages';
import { VIEW } from '../../constants';

import {
	SearchInputContainer,
	SearchInputContainerAi,
	SearchIconContainer,
	CloseButtonAndSpinnerContainer,
} from './styled';
import { useNavigationContext } from '../../contexts/navigationContext';

const ANALYTICS_CONTEXT_DATA = {
	componentName: 'searchInput',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};

const buttonStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${gridSize() * 3}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: `${gridSize() * 3}px`,
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
						<SearchIcon LEGACY_margin="0 2px" color="currentColor" spacing="spacious" label="" />
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
								aria-label="Clear field"
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

export default injectIntl(SearchInputWithContext);
