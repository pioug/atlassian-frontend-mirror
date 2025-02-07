import type { ComponentType, ReactElement, ReactNode, SVGProps as ReactSVGProps } from 'react';

import type {
	IconColor,
	IconColorPressed,
	TextColor,
	TextColorPressed,
} from '@atlaskit/tokens/css-type-schema';

export type Size = 'small' | 'medium' | 'large' | 'xlarge';

export type IconSpacing = 'none' | 'spacious';
type UtilityIconSpacing = 'none' | 'spacious' | 'compact';

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
	/**
	 * Core Icons have only one available size, but can be displayed with additional spacing.
	 * "none" is default, and allows the icon to be placed in buttons and allows the parent component to manage spacing.
	 * "spacious" provides accessible spacing between the icon and other elements.
	 */
	spacing?: IconSpacing;
}

interface NewUtilityGlyphSpacingProps {
	/**
	 * Utility Icons have only one available size, but can be displayed with additional spacing.
	 * "none" is default, and allows the icon to be placed in buttons and allows the parent component to manage spacing.
	 * "compact" provides accessible compact spacing between the icon and other elements.
	 * "spacious" provides accessible spacing between the icon and other elements.
	 */
	spacing?: UtilityIconSpacing;
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

interface NewCoreGlyphProps extends OtherGlyphProps, NewCoreGlyphSpacingProps, NewGlyphColorProps {}
interface NewUtilityGlyphProps
	extends OtherGlyphProps,
		NewUtilityGlyphSpacingProps,
		NewGlyphColorProps {}

export interface IconProps extends GlyphProps, IconInternalGlyphProps {
	/**
	 * Custom icon component that returns an SVG element with set `viewBox`,
	 * `width`, and `height` props.
	 */
	glyph?: ComponentType<CustomGlyphProps>;
}

interface BaseNewIconProps {
	/**
	 * Legacy icon component to render when the icon refresh feature flag is turned off.
	 * The legacy icon defaults to "medium" size, with `primaryColor` set to the value of the `color` prop.
	 */
	LEGACY_fallbackIcon?: ComponentType<IconProps>;
	/**
	 * Optional custom primary color to be rendered by the fallback icon, only to be use when a different color than the `color` prop is required.
	 * @default Use the `color` prop value.
	 */
	LEGACY_primaryColor?: string;
	/**
	 * Secondary color to be rendered by the legacy fallback icon
	 */
	LEGACY_secondaryColor?: string;
	/**
	 * Size of the legacy fallback icon. Legacy icons default to "medium".
	 */
	LEGACY_size?: Size;
	/**
	 * Sets a margin on the fallback legacy icon.
	 */
	LEGACY_margin?: string;
}

export interface UNSAFE_NewCoreGlyphProps
	extends BaseNewIconProps,
		NewCoreGlyphProps,
		IconInternalGlyphProps {
	type?: 'core';
}

export interface UNSAFE_NewUtilityGlyphProps
	extends BaseNewIconProps,
		NewUtilityGlyphProps,
		IconInternalGlyphProps {
	type: 'utility';
}

export type NewCoreIconProps = Omit<UNSAFE_NewCoreGlyphProps, 'dangerouslySetGlyph' | 'type'>;
export type NewUtilityIconProps = Omit<UNSAFE_NewUtilityGlyphProps, 'dangerouslySetGlyph' | 'type'>;

export type UNSAFE_NewGlyphProps = UNSAFE_NewUtilityGlyphProps | UNSAFE_NewCoreGlyphProps;
export type NewIconProps = Omit<UNSAFE_NewGlyphProps, 'dangerouslySetGlyph' | 'type'>;

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

export type IconTileSize = '16' | '24' | '32' | '40' | '48';

export interface IconTileProps {
	/**
	 * The icon to display
	 */
	icon: ComponentType<NewUtilityIconProps> | ComponentType<NewCoreIconProps>;
	/**
	 * The label for the icon
	 */
	label: string;
	/**
	 * The appearance of the tile
	 */
	appearance: IconTileAppearance;
	/**
	 * Size of the tile, in pixels. Defaults to "24".
	 * In a future release, semantic names will be introduced, and number values will be deprecated.
	 */
	size?: IconTileSize;
	/**
	 * Shape of the tile background. Defaults to "square"
	 */
	shape?: 'square' | 'circle';
	/**
	 * Legacy component to render when the icon refresh feature flag is turned off.
	 */
	LEGACY_fallbackComponent?: ReactElement;
	/**
	 * A unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

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

/**
 * The migration outcome for a given legacy icon
 */
type IconMigrationResult = {
	/**
	 * The recommended new icon that the legacy icon should be migrated to
	 */
	newIcon?: {
		name: string;
		type: string;
		package: string;
		isMigrationUnsafe?: boolean;
	};
	/**
	 * Alternative new icon that the legacy icon can be migrated to
	 * Primarily used to maintain migration guidance for icons that have since had a
	 * change to the recommended migration path in "newIcon"
	 */
	additionalIcons?: {
		name: string;
		type: string;
		package: string;
	}[];
	/**
	 * For each size the legacy icon can take, the per-size migration guidance
	 */
	sizeGuidance: Record<Size, IconMigrationSizeGuidance>;
};
export type IconMigrationSizeGuidance =
	| '16-icon-tile'
	| '24-icon-tile'
	| '32-icon-tile'
	| '48-icon-tile'
	| 'swap'
	| 'swap-slight-visual-change'
	| 'swap-visual-change'
	| 'swap-size-shift-utility'
	| 'product-icon'
	| 'not-recommended'
	| 'icon-tile'
	| 'top-nav'
	| 'icon-lab'
	| 'no-larger-size';
export type IconMigrationMap = Record<string, IconMigrationResult>;

export type IconFacadeProps = IconProps & {
	newIcon?: React.ComponentType<NewUtilityIconProps> | React.ComponentType<NewCoreIconProps>;
	iconType?: UNSAFE_NewGlyphProps['type'];
};

interface LEGACY_Data {
	keywords: string[];
	componentName: string;
	package: string;
	packageLoader: () => Promise<{ default: React.ComponentType<any> }>;
}

export type LEGACY_Metadata = Record<string, LEGACY_Data>;
