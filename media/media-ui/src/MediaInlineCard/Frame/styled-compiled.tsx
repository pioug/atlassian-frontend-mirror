/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { token } from '@atlaskit/tokens';
import { css, jsx } from '@compiled/react';

export interface WrapperProps {
	isSelected?: boolean;
	isError?: boolean;
}

const selectedStyles = css({
	cursor: 'pointer',
	boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
	outline: 'none',
	userSelect: 'none',
	borderColor: 'transparent',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&, :hover, :focus, :active': {
		textDecoration: 'none',
	},
});

const notSelectedStyles = css({
	userSelect: 'text',
});

const errorStyles = css({
	backgroundColor: token('color.background.danger'),
	// Unset hover effects
	cursor: 'default',
	'&:hover': {
		backgroundColor: token('color.background.danger'),
	},
});

const wrapperStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '16px',
	paddingTop: token('space.025'),
	paddingRight: token('space.050'),
	paddingBottom: token('space.025'),
	paddingLeft: token('space.050'),
	boxDecorationBreak: 'clone',
	display: 'inline',
	borderRadius: token('radius.small', '3px'),
	color: token('color.text'),
	backgroundColor: token('color.background.neutral'),
	transition: '0.1s all ease-in-out',
	MozUserSelect: 'none',
	cursor: 'pointer',
	'&:hover': {
		backgroundColor: token('color.background.neutral.hovered'),
	},
});

/*
  Media Inline cards should have the following layout:
  -----------------
  | icon | title |
  -----------------
  The aim is to ensure (1) all children are
  in line with each other, (2) are vertically
  centered.
*/
// NB: `padding` consistent with @mentions.
// NB: `display: inline` required for `box-decoration-break` to work.
// NB: `box-decoration-break` required for retaining properties (border-radius) on wrap.
export const Wrapper: React.ForwardRefExoticComponent<Omit<WrapperProps & React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement>, "ref"> & React.RefAttributes<HTMLSpanElement>> = React.forwardRef<
	HTMLSpanElement,
	WrapperProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
>(({ isSelected, isError, children, ...props }, ref) => (
	<span
		ref={ref}
		css={[
			wrapperStyles,
			isSelected && selectedStyles,
			!isSelected && notSelectedStyles,
			isError && errorStyles,
		]}
		data-testid="frame-wrapper"
		{...props}
	>
		{children}
	</span>
));
