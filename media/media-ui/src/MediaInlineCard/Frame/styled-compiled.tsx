/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { token } from '@atlaskit/tokens';
import { css, jsx } from '@compiled/react';
import { B300, N30A, N40A, N900, R50 } from '@atlaskit/theme/colors';

export interface WrapperProps {
	isSelected?: boolean;
	isError?: boolean;
}

const selectedStyles = css({
	cursor: 'pointer',
	boxShadow: `0 0 0 1px ${token('color.border.selected', B300)}`,
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
	backgroundColor: token('color.background.danger', R50),
	// Unset hover effects
	cursor: 'default',
	'&:hover': {
		backgroundColor: token('color.background.danger', R50),
	},
});

const wrapperStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '16px',
	paddingTop: token('space.025', '2px'),
	paddingRight: token('space.050', '4px'),
	paddingBottom: token('space.025', '2px'),
	paddingLeft: token('space.050', '4px'),
	boxDecorationBreak: 'clone',
	display: 'inline',
	borderRadius: token('radius.small', '3px'),
	color: token('color.text', N900),
	backgroundColor: token('color.background.neutral', N30A),
	transition: '0.1s all ease-in-out',
	MozUserSelect: 'none',
	cursor: 'pointer',
	'&:hover': {
		backgroundColor: token('color.background.neutral.hovered', N40A),
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
export const Wrapper = ({
	isSelected,
	isError,
	children,
	...props
}: WrapperProps &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
	<span
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
);
