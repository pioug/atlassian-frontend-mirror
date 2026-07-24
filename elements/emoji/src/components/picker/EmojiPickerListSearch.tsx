/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import SearchIcon from '@atlaskit/icon/core/search';
import TextField from '@atlaskit/textfield';
import VisuallyHidden from '@atlaskit/visually-hidden/visually-hidden';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDebouncedCallback } from 'use-debounce';
import type { Styles } from '../../types';
import { EMOJI_SEARCH_DEBOUNCE } from '../../util/constants';
import { messages } from '../i18n';
import FeatureGates from '@atlaskit/feature-gate-js-client';

const isRefreshEmojiPickerEnabled = (): boolean => {
	if (!FeatureGates.initializeCompleted()) {
		return false;
	}

	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	const isEnabled = FeatureGates.getExperimentValue(
		'platform_teamoji_26_refresh_emoji_picker',
		'isEnabled',
		false,
	);

	return isEnabled;
};

const isEmojiPickerInitialFocusFixEnabled = (): boolean => {
	if (!FeatureGates.initializeCompleted()) {
		return false;
	}

	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	return FeatureGates.getExperimentValue(
		'tef_fix_a11y_keyboard_control_emoji_picker',
		'isEnabled',
		false,
	);
};

const input = css({
	boxSizing: 'border-box',
	color: 'inherit',
	cursor: 'inherit',
	font: token('font.body'),
	outline: 'none',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBlockStart: '1px',
	paddingInlineEnd: token('space.0'),
	paddingBlockEnd: token('space.025'),
	paddingInlineStart: token('space.075'),
	width: '100%',

	'&:invalid': {
		boxShadow: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-ms-clear': {
		display: 'none',
	},
});

const inputNew = css({
	boxSizing: 'border-box',
	color: 'inherit',
	cursor: 'inherit',
	font: token('font.body'),
	outline: 'none',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBlockStart: '2px',
	paddingInlineEnd: token('space.0'),
	paddingBlockEnd: token('space.025'),
	paddingInlineStart: token('space.075'),
	width: '100%',

	'&:invalid': {
		boxShadow: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-ms-clear': {
		display: 'none',
	},
});

const textFieldWrapperNew = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-ds--text-field--container]': {
		borderColor: token('color.border'),
		paddingTop: token('space.050'),
	},
});

const pickerSearch = css({
	boxSizing: 'border-box',
	paddingTop: token('space.150'),
	paddingBottom: token('space.150'),
	paddingLeft: token('space.150'),
	paddingRight: token('space.150'),
	width: '100%',
});

const searchIcon = css({
	opacity: 0.5,
	marginLeft: token('space.negative.025'),
});

const searchIconNew = css({
	opacity: 0.5,
	marginLeft: token('space.negative.025'),
	marginBottom: token('space.negative.025'),
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

export const EmojiPickerListSearch = (props: Props): JSX.Element => {
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
		if (isEmojiPickerInitialFocusFixEnabled()) {
			return;
		}

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
			{isRefreshEmojiPickerEnabled() ? (
				<div css={textFieldWrapperNew}>
					<TextField
						role="searchbox"
						aria-label={formatMessage(messages.searchLabel)}
						css={inputNew}
						autoComplete="off"
						name="search"
						placeholder={`${formatMessage(messages.searchPlaceholder)}...`}
						defaultValue={query || ''}
						onChange={handleOnChange}
						elemBeforeInput={
							<span css={searchIconNew}>
								<SearchIcon color="currentColor" spacing="spacious" label="" />
							</span>
						}
						testId={emojiPickerSearchTestId}
						ref={textRef}
						isCompact
					/>
				</div>
			) : (
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
							<SearchIcon color="currentColor" spacing="spacious" label="" />
						</span>
					}
					testId={emojiPickerSearchTestId}
					ref={textRef}
					isCompact
				/>
			)}
		</div>
	);
};
