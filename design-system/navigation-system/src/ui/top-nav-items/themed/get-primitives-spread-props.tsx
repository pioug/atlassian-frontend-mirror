/**
 * Props from primitives that we explicitly ignore and remove from spread props,
 * because they apply styles.
 *
 * `css` / `className` are not here because primitives don't support them.
 *
 * See `packages/design-system/primitives/src/components/anchor.tsx` and `packages/design-system/primitives/src/components/pressable.tsx`
 * for where these are defined. These shouldn't change very often as the direction is `xcss` over individual props.
 */
export type IgnoredPrimitiveProps =
	| 'style'
	| 'xcss'
	| 'backgroundColor'
	| 'padding'
	| 'paddingBlock'
	| 'paddingBlockStart'
	| 'paddingBlockEnd'
	| 'paddingInline'
	| 'paddingInlineStart'
	| 'paddingInlineEnd';

/**
 * Returns the spread props to pass through to underlying primitive components.
 *
 * It removes the props which apply styles.
 */
// eslint-disable no-unused-vars
export function getPrimitiveSpreadProps<Props extends Record<string, unknown>>({
	style,
	xcss,
	backgroundColor,
	padding,
	paddingBlock,
	paddingBlockStart,
	paddingBlockEnd,
	paddingInline,
	paddingInlineStart,
	paddingInlineEnd,
	...props
}: Props): Omit<Props, IgnoredPrimitiveProps> {
	return props;
}
