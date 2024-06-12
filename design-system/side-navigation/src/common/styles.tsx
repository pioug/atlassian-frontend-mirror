import { type CSSFn, type StatelessCSSFn } from '@atlaskit/menu';
import { B400, B50, N30, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

/**
 * Allows chaining of style functions on top of base style functions
 * @param baseStyle the base custom cssFn
 * @param newStyle a new cssFn to be applied after the base style
 *
 * @deprecated Please avoid using this prop as we intend to remove the prop completely in a future release. See DSP-2682 for more information.
 */
export const overrideStyleFunction = <TState,>(
	baseStyle: CSSFn<TState>,
	newStyle: CSSFn<TState> | undefined = () => ({}),
): CSSFn<TState> => {
	return (state: TState) => {
		return [baseStyle(state), newStyle(state)] as any;
	};
};

const defaultStyles = {
	'&:hover': {
		color: token('color.text.subtle', N500),
		backgroundColor: token('color.background.neutral.subtle.hovered', N30),
	},
	'&:active': {
		color: token('color.text.subtle', B400),
		backgroundColor: token('color.background.neutral.subtle.pressed', B50),
	},
};

const selectedStyles = {
	backgroundColor: token('color.background.selected', N30),
	color: token('color.text.selected', B400),
	':visited': {
		color: token('color.text.selected', B400),
	},
	'&:hover': {
		backgroundColor: token('color.background.selected.hovered', N30),
		color: token('color.text.selected', N500),
	},
	'&:active': {
		backgroundColor: token('color.background.selected.pressed', B50),
		color: token('color.text.selected', B400),
	},
};

export const baseSideNavItemStyle: CSSFn = ({ isSelected, isDisabled }) => {
	return {
		// This padding is set to ensure that the center of the left icon
		// is approximately center aligned with the horizontal app switcher.
		paddingBlock: token('space.100', '8px'),
		paddingInline: token('space.100', '8px'),
		borderRadius: token('border.radius', '3px'),
		// -- TODO: DELETE THESE COLOR OVERRIDES WHEN CLEANING UP FALLBACK THEMING --
		// Menu and side navigation are now color aligned so they do not need this!
		// See: https://product-fabric.atlassian.net/browse/DSP-1684
		backgroundColor: token('color.background.neutral.subtle', 'transparent'),
		...(!isDisabled && !isSelected && defaultStyles),
		...(!isDisabled && isSelected && selectedStyles),
		// -- END TODO --------------------------------------------------------------

		['& [data-item-elem-before]']: {
			height: '1.5rem',
			width: '1.5rem',
		},
	};
};

export const sectionHeaderSpacingStyles: StatelessCSSFn = () => {
	return {
		paddingInline: token('space.100', '8px'),
	};
};
