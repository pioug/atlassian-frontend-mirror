/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import SearchIcon from '@atlaskit/icon/core/search';
import TextField from '@atlaskit/textfield';
import VisuallyHidden from '@atlaskit/visually-hidden';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';
import type { Styles } from '../../types';
import { EMOJI_SEARCH_DEBOUNCE } from '../../util/constants';
import { messages } from '../i18n';

const input = css({
	boxSizing: 'border-box',
	color: 'inherit',
	cursor: 'inherit',
	font: token('font.body'),
	outline: 'none',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBlockStart: '1px',
	paddingInlineEnd: token('space.0', '0px'),
	paddingBlockEnd: token('space.025', '2px'),
	paddingInlineStart: token('space.075', '6px'),
	width: '100%',

	'&:invalid': {
		boxShadow: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-ms-clear': {
		display: 'none',
	},
});

const pickerSearch = css({
	boxSizing: 'border-box',
	paddingTop: token('space.150', '12px'),
	paddingBottom: token('space.150', '12px'),
	paddingLeft: token('space.150', '12px'),
	paddingRight: token('space.150', '12px'),
	width: '100%',
});

const searchIcon = css({
	opacity: 0.5,
	marginLeft: token('space.negative.025', '-2px'),
});

const hidden = css({
	opacity: 0,
	visibility: 'hidden',
	display: 'none',
});

export interface Props {
	isVisible?: boolean;
	onChange: (value: string) => void;
	query?: string;
	resultsCount: number;
	style?: Styles;
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div css={[pickerSearch, !isVisible && hidden]} style={style}>
			<VisuallyHidden id="emoji-search-results-status" role="status">
				{dirty
					? query === ''
						? formatMessage(messages.searchResultsStatusSeeAll)
						: formatMessage(messages.searchResultsStatus, {
								count: resultsCount,
							})
					: null}
			</VisuallyHidden>
			<TextField
				role="searchbox"
				aria-label={formatMessage(messages.searchLabel)}
				css={input}
				autoComplete="off"
				name="search"
				placeholder={`${formatMessage(messages.searchPlaceholder)}...`}
				defaultValue={query || ''}
				onChange={handleOnChange}
				elemBeforeInput={
					<span css={searchIcon}>
						<SearchIcon
							LEGACY_margin="0 0 0 2px"
							color="currentColor"
							spacing="spacious"
							label=""
						/>
					</span>
				}
				testId={emojiPickerSearchTestId}
				ref={textRef}
				isCompact
			/>
		</div>
	);
};
