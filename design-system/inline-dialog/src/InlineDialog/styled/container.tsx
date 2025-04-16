/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	type FocusEventHandler,
	forwardRef,
	type MouseEventHandler,
	type ReactNode,
} from 'react';

import { css, jsx } from '@compiled/react';

import { N0, N50A, N60A, N900 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const CSS_THEME_BACKGROUND = '--theme-background';
const CSS_THEME_COLOR = '--theme-color';
const CSS_THEME_BOX_SHADOW = '--theme-box-shadow';

const containerStyles = css({
	boxSizing: 'content-box',
	maxWidth: `${8 * 56}px`,
	maxHeight: `${8 * 56}px`,
	zIndex: 300,
	background: `var(${CSS_THEME_BACKGROUND})`,
	borderRadius: token('border.radius', '3px'),
	boxShadow: `var(${CSS_THEME_BOX_SHADOW})`,
	color: `var(${CSS_THEME_COLOR})`,
	paddingBlockEnd: token('space.200', '16px'),
	paddingBlockStart: token('space.200', '16px'),
	paddingInlineEnd: token('space.300', '24px'),
	paddingInlineStart: token('space.300', '24px'),
	'&:focus': {
		outline: 'none',
	},
});

interface ContainerProps {
	children: ReactNode | (() => ReactNode);
	onBlur?: FocusEventHandler<HTMLElement>;
	onClick?: MouseEventHandler<HTMLElement>;
	onFocus?: FocusEventHandler<HTMLElement>;
	style: CSSProperties;
	testId?: string;
}

/**
 * __Container__
 *
 * A container is used as a styled wrapper around the contents of an inline dialog.
 * Note that the styles here are merged with the style prop that comes from the popper.js library.
 *
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
	({ children, onBlur, onClick, onFocus, style, testId }, ref) => {
		return (
			// Unfortunately, these are used for products to pass through. Inline Dialog is being deprecated anyway
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
			<div
				css={containerStyles}
				data-testid={testId}
				onBlur={onBlur}
				onClick={onClick}
				onFocus={onFocus}
				ref={ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={
					{
						[CSS_THEME_BACKGROUND]: token('elevation.surface.overlay', N0),
						[CSS_THEME_COLOR]: token('color.text', N900),
						[CSS_THEME_BOX_SHADOW]: token(
							'elevation.shadow.overlay',
							`0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
						),
						...style,
					} as unknown as CSSProperties
				}
			>
				{typeof children === 'function' ? children() : children}
			</div>
		);
	},
);
