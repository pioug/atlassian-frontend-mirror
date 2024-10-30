export type {
	Dimension,
	BackgroundColor,
	Space,
	BorderColor,
	BorderRadius,
	BorderWidth,
	Layer,
	TextColor,
	Shadow,
} from './xcss/style-maps.partial';

export { default as Box } from './components/box';
export type { BoxProps } from './components/box';
export { default as Inline } from './components/inline';
export type { InlineProps } from './components/inline';
export { xcss, tokensMap } from './xcss/xcss';
export type { XCSS } from './xcss/xcss';
export { default as Stack } from './components/stack';
export type { StackProps } from './components/stack';
export { default as Flex } from './components/flex';
export type { FlexProps } from './components/flex';
export { default as Grid } from './components/grid';
export type { GridProps } from './components/grid';
export { default as Bleed } from './components/bleed';
export type { BleedProps } from './components/bleed';
export { default as Text } from './components/text';
export type { TextProps } from './components/text';
export { default as Pressable } from './components/pressable';
export type { PressableProps } from './components/pressable';
export {
	/**
	 * @deprecated Use `Anchor` instead. This will be removed in a future major release.
	 */
	default as UNSAFE_ANCHOR,
	default as Anchor,
} from './components/anchor';
export type {
	/**
	 * @deprecated Use `AnchorProps` instead. This will be removed in a future major release.
	 */
	AnchorProps as UNSAFE_AnchorProps,
	AnchorProps,
} from './components/anchor';
export { media, UNSAFE_media, UNSAFE_BREAKPOINTS_CONFIG } from './responsive';
export type { Breakpoint, MediaQuery } from './responsive';
export { useSurface as UNSAFE_useSurface } from './components/internal/surface-provider';
export { inverseColorMap as UNSAFE_inverseColorMap } from './xcss/style-maps.partial';
