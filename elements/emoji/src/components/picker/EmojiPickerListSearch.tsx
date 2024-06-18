/** @jsx jsx */
import SearchIcon from '@atlaskit/icon/glyph/search';
import TextField from '@atlaskit/textfield';
import VisuallyHidden from '@atlaskit/visually-hidden';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';
import type { Styles } from '../../types';
import { EMOJI_SEARCH_DEBOUNCE } from '../../util/constants';
import { hidden } from '../common/styles';
import { messages } from '../i18n';
import { input, pickerSearch, searchIcon } from './styles';

export interface Props {
	style?: Styles;
	query?: string;
	isVisible?: boolean;
	onChange: (value: string) => void;
	resultsCount: number;
}

export const emojiPickerSearchTestId = 'emoji-picker-search';

export const EmojiPickerListSearch = (props: Props) => {
	const { style, query, isVisible = true, resultsCount, onChange } = props;
	const textRef = useRef<HTMLInputElement>(null);
	const [dirty, setDirty] = useState(false);

	const { formatMessage } = useIntl();

	// Debounce callback
	const [debouncedSearch] = useDebouncedCallback(
		(value: string) => {
			onChange(value);
			setDirty(true);
		},
		// delay in ms
		EMOJI_SEARCH_DEBOUNCE,
	);

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSearch(e.target.value);
	};

	useLayoutEffect(() => {
		requestAnimationFrame(() => {
			if (textRef) {
				textRef.current?.focus();
			}
		});
	}, []);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={[pickerSearch, !isVisible && hidden]} style={style}>
			<VisuallyHidden id="emoji-search-results-status" role="status">
				{dirty && query === '' && formatMessage(messages.searchResultsStatusSeeAll)}
				{query !== '' &&
					formatMessage(messages.searchResultsStatus, {
						count: resultsCount,
					})}
			</VisuallyHidden>
			<TextField
				role="searchbox"
				aria-label={formatMessage(messages.searchLabel)}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={input}
				autoComplete="off"
				name="search"
				placeholder={`${formatMessage(messages.searchPlaceholder)}...`}
				defaultValue={query || ''}
				onChange={handleOnChange}
				elemBeforeInput={
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					<span css={searchIcon}>
						<SearchIcon label="" />
					</span>
				}
				testId={emojiPickerSearchTestId}
				ref={textRef}
				isCompact
			/>
		</div>
	);
};
