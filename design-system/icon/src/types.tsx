import type { ComponentType, ReactElement, ReactNode, SVGProps as ReactSVGProps } from 'react';

import type {
	IconColor,
	IconColorPressed,
	TextColor,
	TextColorPressed,
} from '@atlaskit/tokens/css-type-schema';

export type Size = 'small' | 'medium' | 'large' | 'xlarge';

export type IconSpacing = 'none' | 'spacious' | 'compact';
export type IconSize = 'small' | 'medium';

export interface CustomGlyphProps extends ReactSVGProps<SVGSVGElement> {
	/**
	 * provided to a custom glyph
	 */
	'data-testid'?: string;

	/**
	 * provided to a custom glyph
	 */
	'aria-label'?: string;

	/**
	 * provided classname for custom glyph to match ADG styles
	 */
	className?: string;
}

interface GlyphColorProps {
	/**
	 * Primary color for the icon.
	 * Inherits the current font color by default.
	 */
	primaryColor?: string;

	/**
	 * Secondary color for the icon.
	 * Defaults to the page background for an icon that supports two colors.
	 */
	secondaryColor?: string;
}

/**
 * NOTE: we want to move away from icons using text colors and make the icon tokens darker - so currentColor will eventually go away, and
 * we will be shifting existing usages down (`color.text` -> `color.icon` -> `color.icon.`) via a codemod.
 * For now, icon defaults to `color.text` under the hood to emulate the darker appearance.
 */
export interface NewGlyphColorProps {
	/**
	 * Color for the icon. Supports any icon or text design token, or 'currentColor' to inherit the current text color.
	 * Defaults to `currentColor`, inheriting the current text color.
	 */
	color?:
		| IconColor
		| IconColorPressed
		| Exclude<TextColor, 'transparent'>
		| TextColorPressed
		| 'currentColor';
}

interface GlyphSizeProps {
	/**
	 * There are three icon sizes – small (16px), medium (24px), and large (32px).
	 * This pixel size refers to the canvas the icon sits on,
	 * not the size of the icon shape itself.
	 */
	size?: Size;
}

interface NewCoreGlyphSpacingProps {
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
	/**
	 * @deprecated Use a `Flex` wrapper with `cssMap` padding tokens instead. Migrate with the `32.0.2-icon-spacing-to-flex-primitive` codemod in `npx @atlaskit/codemod-cli`, or the `no-icon-spacing-prop` ESLint rule.
	 */
	spacing?: IconSpacing;
}

interface NewCoreGlyphSizeProps {
	/**
	 * There are two icon sizes available:
	 * - `medium` - 16px. (default).
	 * - `small` - 12px.
	 *
	 * Alternatively a function can be passed to determine the size
	 * based on the icon's name, which can be useful for dynamic rendering.
	 */
	size?: IconSize | ((iconName: string) => IconSize);
}

interface OtherGlyphProps {
	/**
	 * Text used to describe what the icon is in context.
	 * A label is needed when there is no pairing visible text next to the icon.
	 * An empty string marks the icon as presentation only.
	 */
	label: string;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

/**
 * Props for legacy icons –– including the children prop to resolve R18 type errors
 */
interface LegacyOtherGlyphProps {
	/**
	 * Text used to describe what the icon is in context.
	 */
	label: string;

	/**
	 * A `testId` prop is provided for specified elements,
	 */
	testId?: string;

	/**
	 * Used to opt out of the icon facade.
	 */
	isFacadeDisabled?: boolean;

	/**
	 * The content to be rendered inside the glyph component.
	 * Only for legacy icons that used R16's implicit children prop.
	 * It doesn't actually serve any purpose, but is required to resolve R18 type errors
	 * without updating all the legacy icon usages.
	 */
	children?: ReactNode;
}

interface IconInternalGlyphProps {
	/**
	 * @deprecated
	 * Custom icon string that should contain an SVG element with set `viewBox`,
	 * `width`, and `height` attributes.
	 * It's recommended to use the `glyph` prop instead.
	 */
	dangerouslySetGlyph?: string;
}

export interface GlyphProps extends LegacyOtherGlyphProps, GlyphSizeProps, GlyphColorProps {}

interface NewCoreGlyphProps
	extends OtherGlyphProps, NewCoreGlyphSpacingProps, NewCoreGlyphSizeProps, NewGlyphColorProps {}

export interface IconProps extends GlyphProps, IconInternalGlyphProps {
	/**
	 * Custom icon component that returns an SVG element with set `viewBox`,
	 * `width`, and `height` props.
	 */
	glyph?: ComponentType<CustomGlyphProps>;
}

export interface UNSAFE_NewCoreGlyphProps extends NewCoreGlyphProps, IconInternalGlyphProps {
	shouldRecommendSmallIcon?: boolean;
	/**
	 * Display name of the icon.
	 */
	name?: string;
}

export type NewCoreIconProps = Omit<UNSAFE_NewCoreGlyphProps, 'dangerouslySetGlyph'>;

export type UNSAFE_NewGlyphProps = UNSAFE_NewCoreGlyphProps;
export type NewIconProps = Omit<UNSAFE_NewGlyphProps, 'dangerouslySetGlyph'>;

export type IconTileAppearance =
	| 'gray'
	| 'blue'
	| 'teal'
	| 'green'
	| 'lime'
	| 'yellow'
	| 'orange'
	| 'red'
	| 'magenta'
	| 'purple'
	| 'grayBold'
	| 'blueBold'
	| 'tealBold'
	| 'greenBold'
	| 'limeBold'
	| 'yellowBold'
	| 'orangeBold'
	| 'redBold'
	| 'magentaBold'
	| 'purpleBold';

export type IconTileSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

interface IconTileBaseProps {
	/**
	 * The icon to display
	 */
	icon: ComponentType<NewCoreIconProps>;
	/**
	 * The label for the icon
	 */
	label: string;
	/**
	 * The appearance of the tile
	 */
	appearance: IconTileAppearance;
	/**
	 * Size of the tile. Defaults to `medium`.
	 *
	 * Available sizes: `xsmall`, `small`, `medium`, `large`, `xlarge`.
	 */
	size?: IconTileSize;
	/**
	 * A unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

interface IconTileSquareProps extends IconTileBaseProps {
	/**
	 * Shape of the tile background. Defaults to "square".
	 */
	shape?: 'square';
	/**
	 * A component to render in place of circle shaped icon tiles, swapped out with a feature flag.
	 *
	 * Only applicable when `shape="circle"`.
	 */
	UNSAFE_circleReplacementComponent?: never;
}

interface IconTileCircleProps extends IconTileBaseProps {
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
	/**
	 * Shape of the tile background.
	 * @deprecated Circle shape is deprecated and will be removed in a future version. Consider migrating to alternatives such as a square tile, or an `IconButton` for interactive elements.
	 * If necessary, the only way to retain a circle appearance is to rebuild the component custom using ADS primitives. The prop `UNSAFE_circleReplacementComponent` can be used to
	 * implement alternatives.
	 */
	shape: 'circle';
	/**
	 * A component to render in place of circle shaped icon tiles, swapped out with a feature flag.
	 *
	 * Required when `shape="circle"`. This prop is temporary, and will be used by ADS to safely
	 * rollout alternatives as circle shaped icon tiles are deprecated.
	 */
	UNSAFE_circleReplacementComponent: ReactElement;
}

export type IconTileProps = IconTileSquareProps | IconTileCircleProps;

export interface SkeletonProps {
	/*
	 * Sets the color of the skeleton.
	 * By default it will inherit the current text color.
	 */
	color?: string;

	/*
	 * Controls the size of the skeleton.
	 */
	size?: Size;

	/*
	 * Determines the opacity of the skeleton.
	 */
	weight?: 'normal' | 'strong';

	/**
	 * A unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

export interface SVGProps extends GlyphProps {
	/**
	 * The children of the SVG, should still honour the constraints of icons
	 */
	children?: ReactNode;
}

interface LEGACY_Data {
	keywords: string[];
	componentName: string;
	package: string;
	packageLoader: () => Promise<{ default: React.ComponentType<any> }>;
}

export type LEGACY_Metadata = Record<string, LEGACY_Data>;
