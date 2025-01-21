/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo, useCallback, useEffect, useRef } from 'react';

import { css, jsx } from '@compiled/react';

import noop from '@atlaskit/ds-lib/noop';
import { Grid } from '@atlaskit/primitives/compiled';
import { B200, B400, B50, N0, N200, N30, N40, N500, N600, N900 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { TabIndex } from '../../types';
import type { DateObj } from '../types';

const dateCellSiblingStyle = css({
	color: token('color.text.subtlest', N200),
	'&:hover': {
		color: token('color.text.subtlest', N200),
	},
});

const dateCellTodayStyle = css({
	color: token('color.text.selected', B400),
	fontWeight: token('font.weight.bold', 'bold'),
	'&::after': {
		display: 'block',
		height: 2,
		position: 'absolute',
		backgroundColor: 'currentColor',
		content: '""',
		insetBlockEnd: token('space.025', '2px'),
		insetInlineEnd: token('space.025', '2px'),
		insetInlineStart: token('space.025', '2px'),
	},
});

const dateCellPrevSelectedStyle = css({
	backgroundColor: token('color.background.selected', B50),
	color: token('color.text.subtle', N600),
	'&:hover': {
		color: token('color.text.subtle', N600),
	},
});

const dateCellSelectedStyle = css({
	backgroundColor: token('color.background.selected', N500),
	color: token('color.text.selected', N0),
	'&:hover': {
		backgroundColor: token('color.background.selected.hovered', B50),
		color: token('color.text.selected', N600),
	},
});

const dateCellDisabledStyle = css({
	color: token('color.text.disabled', N40),
	cursor: 'not-allowed',
	'&:hover': {
		backgroundColor: 'transparent',
		color: token('color.text.disabled', N40),
	},
});

const dateCellStyles = css({
	all: 'unset',
	display: 'block',
	// TODO (AFB-874): Disabling due to fixing for expand-spacing-property produces further ESLint errors
	// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
	padding: `${token('space.050', '4px')} 9px`,
	position: 'relative',
	flexGrow: 1,
	backgroundColor: 'transparent',
	borderColor: 'transparent',
	borderRadius: 3,
	borderStyle: 'solid',
	borderWidth: '2px',
	color: token('color.text', N900),
	cursor: 'pointer',
	font: token('font.body'),
	textAlign: 'center',
	'&:focus-visible': {
		borderColor: token('color.border.focused', B200),
		borderStyle: 'solid',
		borderWidth: '2px',
	},
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N30),
		color: token('color.text', N900),
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed', B50),
		color: token('color.text', N900),
	},
});

interface DateProps {
	children: number;
	isDisabled?: boolean;
	isFocused?: boolean;
	isToday?: boolean;
	dayLong: string;
	month: number;
	monthLong: string;
	onClick?: ({ day, month, year }: DateObj) => void;
	isPreviouslySelected?: boolean;
	isSelected?: boolean;
	isSibling?: boolean;
	year: number;
	shouldSetFocus: boolean;
	tabIndex: TabIndex;
	testId?: string;
}

const Date = memo(
	forwardRef<HTMLButtonElement, DateProps>(function Date(
		{
			children: day,
			isDisabled = false,
			isFocused = false,
			isToday = false,
			dayLong,
			month,
			monthLong,
			onClick = noop,
			isPreviouslySelected = false,
			isSelected = false,
			isSibling = false,
			year,
			shouldSetFocus,
			tabIndex,
			testId,
		},
		_ref,
	) {
		const dateRef = useRef({ day, month, year, isDisabled });

		useEffect(() => {
			dateRef.current = {
				day,
				month,
				year,
				isDisabled,
			};
		}, [day, month, year, isDisabled]);

		const focusRef = useRef(null);

		useEffect(() => {
			if (isFocused && shouldSetFocus && focusRef.current) {
				(focusRef.current as HTMLButtonElement).focus();
			}
		}, [isFocused, shouldSetFocus]);

		const handleClick = useCallback(() => {
			const {
				day: dayValue,
				month: monthValue,
				year: yearValue,
				isDisabled: isDisabledValue,
			} = dateRef.current;

			if (!isDisabledValue) {
				onClick({
					day: dayValue,
					month: monthValue,
					year: yearValue,
				});
			}
		}, [onClick]);

		return (
			<Grid role="gridcell" alignItems="center">
				<button
					css={[
						dateCellStyles,
						isSibling && dateCellSiblingStyle,
						isToday && dateCellTodayStyle,
						isPreviouslySelected && dateCellPrevSelectedStyle,
						isSelected && dateCellSelectedStyle,
						isDisabled && dateCellDisabledStyle,
					]}
					aria-current={isToday ? 'date' : undefined}
					aria-disabled={isDisabled || undefined}
					aria-label={`${day}, ${dayLong} ${monthLong} ${year}`}
					aria-pressed={isSelected ? 'true' : 'false'}
					tabIndex={isFocused ? tabIndex : -1}
					type="button"
					onClick={handleClick}
					ref={focusRef}
					data-disabled={isDisabled || undefined}
					data-focused={isFocused || undefined}
					data-prev-selected={isPreviouslySelected || undefined}
					data-selected={isSelected || undefined}
					data-sibling={isSibling || undefined}
					data-today={isToday || undefined}
					data-testid={testId && (isSelected ? `${testId}--selected-day` : `${testId}--day`)}
				>
					{day}
				</button>
			</Grid>
		);
	}),
);

Date.displayName = 'Date';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Date;
