import type {
  ComponentType,
  SVGProps as ReactSVGProps,
  ReactNode,
} from 'react';

export type Size = 'small' | 'medium' | 'large' | 'xlarge';

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

export interface GlyphColorProps {
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

export interface GlyphSizeProps {
  /**
   * There are three icon sizes – small (16px), medium (24px), and large (32px).
   * This pixel size refers to the canvas the icon sits on,
   * not the size of the icon shape itself.
   */
  size?: Size;
}

export interface OtherGlyphProps {
  /**
   * Text used to describe what the icon is in context.
   * A label is needed when there is no pairing visible text next to the icon.
   * An empty string marks the icon as presentation only
   */
  label: string;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

export interface GlyphProps
  extends OtherGlyphProps,
    GlyphSizeProps,
    GlyphColorProps {}

export interface IconProps extends GlyphProps {
  /**
   * Custom icon component that returns an SVG element with set `viewBox`,
   * `width`, and `height` props.
   */
  glyph?: ComponentType<CustomGlyphProps>;

  /**
   * @deprecated
   * Custom icon string that should contain an SVG element with set `viewBox`,
   * `width`, and `height` attributes.
   * It's recommended to use the `glyph` prop instead.
   */
  dangerouslySetGlyph?: string;
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
