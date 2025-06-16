import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { B300, N30A, N40A, N900, R50 } from '@atlaskit/theme/colors';
import { type WrapperProps } from './styled-compiled';

const selected = `
  cursor: pointer;
  box-shadow: 0 0 0 1px ${token('color.border.selected', B300)};
  outline: none;
  user-select: none;
  border-color: transparent;
  &, :hover, :focus, :active {
    text-decoration: none;
  }
`;

const isSelected = ({ isSelected }: WrapperProps) => {
	if (isSelected) {
		return selected;
	} else {
		return 'user-select: text';
	}
};

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
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Wrapper = styled.span<WrapperProps>(
	{
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '16px',
		padding: `${token('space.025', '2px')} ${token('space.050', '4px')} ${token(
			'space.025',
			'2px',
		)} ${token('space.050', '4px')}`,
		boxDecorationBreak: 'clone',
		display: 'inline',
		borderRadius: token('border.radius', '3px'),
		color: token('color.text', N900),
		backgroundColor: token('color.background.neutral', N30A),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	(props) => isSelected(props),
	{
		transition: '0.1s all ease-in-out',
		MozUserSelect: 'none',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered', N40A),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	(props) =>
		props.isError && {
			backgroundColor: token('color.background.danger', R50),
			cursor: 'default',
			'&:hover': {
				backgroundColor: token('color.background.danger', R50),
			},
		},
);
