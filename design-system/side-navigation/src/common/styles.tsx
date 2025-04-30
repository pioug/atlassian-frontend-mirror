import { type CSSFn, type StatelessCSSFn } from '@atlaskit/menu';
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

export const sectionHeaderSpacingStyles: StatelessCSSFn = () => {
	return {
		paddingInline: token('space.100', '8px'),
	};
};
