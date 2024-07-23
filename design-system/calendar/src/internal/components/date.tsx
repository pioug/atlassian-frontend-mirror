/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo, useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import noop from '@atlaskit/ds-lib/noop';
import { Grid } from '@atlaskit/primitives';

import type { TabIndex } from '../../types';
import { dateCellStyles as getDateCellStyles } from '../styles/date';
import type { DateObj } from '../types';

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

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		const dateCellStyles = css(getDateCellStyles());

		return (
			<Grid role="gridcell" alignItems="center">
				<button
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
					css={dateCellStyles}
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
