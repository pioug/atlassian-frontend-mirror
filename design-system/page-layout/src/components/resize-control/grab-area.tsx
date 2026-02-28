/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import * as React from 'react';
import { type ComponentProps, type FocusEvent, type KeyboardEvent, type MouseEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { GRAB_AREA_LINE_SELECTOR, GRAB_AREA_SELECTOR } from '../../common/constants';
import { type LeftSidebarProps } from '../../common/types';

type GrabAreaProps = {
	isDisabled: boolean;
	isLeftSidebarCollapsed: boolean;
	label: string;
	leftSidebarPercentageExpanded: number;
	onBlur: (event: FocusEvent) => void;
	onFocus: (event: FocusEvent) => void;
	onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
	onMouseDown: (event: MouseEvent<HTMLButtonElement>) => void;
	testId?: string;
	valueTextLabel?: string;
} & Omit<ComponentProps<'button'>, 'ref'>;

/**
 * Determines the color of the grab line.
 *
 * Used on internal leaf node, so naming collisions won't matter.
 */
const varLineColor = '--ds-line';

const grabAreaStyles = css({
	width: token('space.200', '16px'),
	height: '100%',
	padding: 0,
	backgroundColor: 'transparent',
	border: 0,
	cursor: 'ew-resize',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-moz-focus-inner': {
		border: 0,
	},
	'&:focus': {
		outline: 0,
	},
	'&:enabled:hover, &:enabled:focus, &:enabled:active': {
		[varLineColor]: token('color.border.selected', B200),
	},
});

const grabAreaCollapsedStyles = css({
	height: `calc(100% - ${token('space.600', '3rem')} * 2)`,
	padding: 0,
	position: 'absolute',
	backgroundColor: 'transparent',
	border: 0,
	cursor: 'default',
	insetBlockEnd: 0,
});

const lineStyles = css({
	display: 'block',
	width: '2px',
	height: '100%',
	backgroundColor: 'var(--ds-line)',
	transition: 'background-color 200ms',
});

const grabAreaLineSelector = { [GRAB_AREA_LINE_SELECTOR]: true };
const grabAreaSelector = { [GRAB_AREA_SELECTOR]: true };

const GrabArea: React.ForwardRefExoticComponent<
	{
		isDisabled: boolean;
		isLeftSidebarCollapsed: boolean;
		label: string;
		leftSidebarPercentageExpanded: number;
		onBlur: (event: FocusEvent) => void;
		onFocus: (event: FocusEvent) => void;
		onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
		onMouseDown: (event: MouseEvent<HTMLButtonElement>) => void;
		testId?: string;
		valueTextLabel?: string;
	} & Omit<
		React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
		'ref'
	> &
		Partial<LeftSidebarProps> &
		React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, GrabAreaProps & Partial<LeftSidebarProps>>(
	(
		{
			testId,
			valueTextLabel = 'Width',
			isDisabled,
			isLeftSidebarCollapsed,
			label,
			leftSidebarPercentageExpanded,
			onKeyDown,
			onMouseDown,
			onBlur,
			onFocus,
			...rest
		},
		ref,
	) => {
		return (
			<button
				ref={ref}
				{...grabAreaSelector}
				aria-label={label}
				data-testid={testId}
				disabled={isDisabled}
				aria-hidden={isLeftSidebarCollapsed}
				type="button"
				// The slider role is applied to a button to utilize the native
				// interactive and disabled functionality on the resize slider. While a
				// range input would be more semantically accurate, it does not affect
				// usability.
				role="slider"
				css={
					isLeftSidebarCollapsed
						? ([grabAreaStyles, grabAreaCollapsedStyles] as any)
						: (grabAreaStyles as any)
				}
				aria-orientation="vertical"
				aria-valuenow={leftSidebarPercentageExpanded}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuetext={`${valueTextLabel} ${leftSidebarPercentageExpanded}%`}
				onKeyDown={onKeyDown}
				onMouseDown={onMouseDown}
				onFocus={onFocus}
				onBlur={onBlur}
				{...rest}
			>
				<span css={lineStyles} {...grabAreaLineSelector} />
			</button>
		);
	},
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default GrabArea;
