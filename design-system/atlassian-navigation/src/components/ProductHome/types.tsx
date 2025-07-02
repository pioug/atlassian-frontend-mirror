import { type ComponentType, type MouseEvent } from 'react';

import { type LogoProps } from '@atlaskit/logo';

export interface ProductHomeProps {
	/**
	 * The product icon.
	 * Expected to be an Icon from the Atlaskit Logo package. Visible on smaller screen sizes.
	 */
	icon: ComponentType<Partial<Omit<LogoProps, 'appearance'> & { size?: 'small' }>>;

	/**
	 * The product logo,
	 * visible on larger screen sizes.
	 */
	logo: ComponentType<Partial<Omit<LogoProps, 'appearance'> & { size?: 'small' }>>;

	/**
	 * Maximum width in pixel, that logo can acquire. Defaults to 260px.
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

	/* eslint-disable jsdoc/require-asterisk-prefix */
	/**
    A `testId` prop is provided for specified elements,
    which is a unique string that appears as a data attribute `data-testid` in the rendered code,
    serving as a hook for automated tests.

    Will set these elements when defined:

    - Root element of the component - `{testId}-container`
    - Product logo shown at large screen sizes - `{testId}-logo`
    - Product icon shown at small screen sizes - `{testId}-icon`
    - Site title - `{testId}-site-title`
   */
	testId?: string;
	/* eslint-enable jsdoc/require-asterisk-prefix */

	// We _could_ have a `label` prop to align with other, newer components.
	// But `aria-label` is already being used in products,
	// and is already supported because of spread props.
	// This just makes it explicit to consumers that we are applying it.
	/**
	 * Provide an accessible label, often used by screen readers.
	 */
	'aria-label'?: string;
}

export interface AppHomeProps {
	/**
	 * The product icon.
	 * Expected to be an Icon from the Atlaskit Logo package. Visible at all screen sizes.
	 */
	icon: ComponentType<LogoProps>;

	/**
	 * The name of the app.
	 * Displays next to the icon, visible at larger screen sizes.
	 */
	name: string;

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

	/* eslint-disable jsdoc/require-asterisk-prefix */
	/**
    A `testId` prop is provided for specified elements,
    which is a unique string that appears as a data attribute `data-testid` in the rendered code,
    serving as a hook for automated tests.

    Will set these elements when defined:

    - Root element of the component - `{testId}-container`
    - Product logo shown at large screen sizes - `{testId}-logo`
    - Product icon shown at small screen sizes - `{testId}-icon`
    - Site title - `{testId}-site-title`
   */
	testId?: string;
	/* eslint-enable jsdoc/require-asterisk-prefix */

	// We _could_ have a `label` prop to align with other, newer components.
	// But `aria-label` is already being used in products,
	// and is already supported because of spread props.
	// This just makes it explicit to consumers that we are applying it.
	/**
	 * Provide an accessible label, often used by screen readers.
	 */
	'aria-label'?: string;
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
	 * Maximum width of the logo, in pixels. Defaults to 260px.
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

	/* eslint-disable jsdoc/require-asterisk-prefix */
	/**
    A `testId` prop is provided for specified elements,
    which is a unique string that appears as a data attribute `data-testid` in the rendered code,
    serving as a hook for automated tests.

    Will set these elements when defined:

    - Root element of the component - `{testId}-container`
    - Product logo shown at large screen sizes - `{testId}-logo`
    - Product icon shown at small screen sizes - `{testId}-icon`
    - Site title - `{testId}-site-title`
   */
	testId?: string;
	/* eslint-enable jsdoc/require-asterisk-prefix */
}
