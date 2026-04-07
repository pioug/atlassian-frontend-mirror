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

import { token } from '@atlaskit/tokens';

const containerStyles = css({
	boxSizing: 'content-box',
	maxWidth: '448px',
	maxHeight: '448px',
	zIndex: 300,
	backgroundColor: token('elevation.surface.overlay'),
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay'),
	color: token('color.text'),
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.300'),
	paddingInlineStart: token('space.300'),
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
export const Container: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ContainerProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, ContainerProps>(
	({ children, onBlur, onClick, onFocus, style, testId }, ref) => {
		return (
			// Unfortunately, these are used for apps to pass through. Inline Dialog is being deprecated anyway
			// eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/no-static-element-interactions
			<div
				css={containerStyles}
				data-testid={testId}
				onBlur={onBlur}
				onClick={onClick}
				onFocus={onFocus}
				ref={ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={style}
			>
				{typeof children === 'function' ? children() : children}
			</div>
		);
	},
);
