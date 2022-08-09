import { CSSObject } from '@emotion/core';

export type CSSProperties = CSSObject & {
  backgroundColor: string;
  color: string;
};

export type ButtonCSSProperties = CSSProperties & {
  boxShadow: string;
};

export type ButtonFocusCSSProperties = {
  boxShadow: string;
  color: string;
  backgroundColor: string;
};

export type ButtonCSSContext = {
  default: ButtonCSSProperties;
  hover: ButtonCSSProperties;
  focus: ButtonFocusCSSProperties;
  active: ButtonCSSProperties;
  selected: ButtonCSSProperties;
};

export type CreateCSS = ButtonCSSContext;

export type IconButtonCSS = ButtonCSSContext;

export type PrimaryButtonCSS = ButtonCSSContext;

export type NavigationCSS = CSSProperties;

type LogoStyleProps = {
  iconGradientStart?: string;
  iconGradientStop?: string;
  iconColor?: string;
  textColor?: string;
};
export type ProductHomeCSS = CSSProperties & LogoStyleProps;

export type SearchCSS = {
  default: CSSProperties;
  focus: CSSObject;
  hover: CSSObject;
};

export type SkeletonCSS = CSSObject & {
  backgroundColor: string;
  opacity: number;
};

// This is the shape of a theme 'mode', e.g. light, dark, or custom
export type Mode = {
  create: CreateCSS;
  iconButton: IconButtonCSS;
  navigation: NavigationCSS;
  primaryButton: PrimaryButtonCSS;
  productHome: ProductHomeCSS;
  search: SearchCSS;
  skeleton: SkeletonCSS;
};

export type NavigationTheme = {
  mode: Mode;
};

export type Colors = {
  backgroundColor: string;
  color: string;
};

export type GenerateThemeArgs = {
  /**
   * Name of the theme.
   * If you pass in "atlassian" will return the default atlassian theme and not
   * use any of the colors you pass in.
   */
  name?: string;

  /**
   * Main background color of the horizontal navigation bar.
   */
  backgroundColor: string;

  /**
   * Highlight color for the navigation actions.
   */
  highlightColor: string;
};
