import { ComponentType, MouseEvent } from 'react';

import { LogoProps } from '@atlaskit/logo';

export interface ProductHomeProps {
  /**
   * The product icon.
   * Expected to be an Icon from the Atlaskit Logo package. Visible on smaller screen sizes
   */
  icon: ComponentType<Partial<LogoProps>>;

  /**
   * The product logo,
   * visible on larger screen sizes
   */
  logo: ComponentType<Partial<LogoProps>>;

  /**
   * Maximum width in pixel, that logo can aquire. Defaults to 260px.
   */
  logoMaxWidth?: number;

  /**
   * Optional onClick handler.
   */
  onClick?: (event: MouseEvent<HTMLElement>) => void;

  /**
   * Optional mouseDown handler.
   */
  onMouseDown?: (event: MouseEvent<HTMLElement>) => void;

  /**
   * Href to be passed to product home.
   * Will add an interactive look and feel when defined.
   */
  href?: string;

  /**
   * Name of the site that appears next to the logo.
   */
  siteTitle?: string;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.

   * Will set these elements when defined:

   * - Root element of the component - `{testId}-container`
   * - Product logo shown at large screen sizes - `{testId}-logo`
   * - Product icon shown at small screen sizes - `{testId}-icon`
   * - Site title - `{testId}-site-title`
   */
  testId?: string;
}

export interface CustomProductHomeProps {
  /**
   * Alt text for the icon that is displayed on small viewports.
   */
  iconAlt: string;

  /**
   * Url for the icon that is displayed on small viewports.
   */
  iconUrl: string;

  /**
   * Alt text for the icon that is displayed on large viewports.
   */
  logoAlt: string;

  /**
   * Url for the icon that is displayed on large viewports.
   */
  logoUrl: string;

  /**
   * Maximum width in pixel, that logo can aquire. Defaults to 260px.
   */
  logoMaxWidth?: number;

  /**
   * Optional onClick handler.
   */
  onClick?: (event: MouseEvent<HTMLElement>) => void;

  /**
   * Optional mouseDown handler.
   */
  onMouseDown?: (event: MouseEvent<HTMLElement>) => void;

  /**
   * Href to be passed to product home.
   * Will add an interactive look and feel when defined.
   */
  href?: string;

  /**
   * Name of the site that appears next to the logo
   */
  siteTitle?: string;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.

   * Will set these elements when defined:

   * - Root element of the component - `{testId}-container`
   * - Product logo shown at large screen sizes - `{testId}-logo`
   * - Product icon shown at small screen sizes - `{testId}-icon`
   * - Site title - `{testId}-site-title`
   */
  testId?: string;
}
