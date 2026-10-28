/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - FlyOutMenuItem
 *
 * @codegen <<SignedSource::e97c344e0161573affc94e7042d0692e>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::956ce4482c6294788d7a91427e49339f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/FlyOutMenuItem.tsx <<SignedSource::9ff214c7b25bccb35c5fb469df155b75>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';
import type { IconProps } from '../../__generated__/IconProps.codegen';

export type FlyOutMenuItemProps = {
	/**
	 * The display label for the expandable menu item.
	 */
	label: string;
	/**
	 * The icon to display before the label. Accepts either a UI Kit icon glyph name, or an image source:
	 * a local app asset, a hosted URL (its host must be declared in `permissions.external.images` in the
	 * app manifest), a data URI, or a root-relative path. If omitted, no icon is shown.
	 */
	icon?: IconProps['glyph'] | string;
	/**
	 * The icon to display instead of `icon` when dark mode is selected. Accepts the same values as `icon`
	 * and follows the same rules. If omitted, `icon` is also used in dark mode.
	 */
	iconDark?: IconProps['glyph'] | string;
	/**
	 * Should contain FlyoutMenuItemTrigger and FlyoutMenuItemContent
	 */
	children: React.ReactElement | React.ReactElement[];
};

export type TFlyOutMenuItem<T> = (props: FlyOutMenuItemProps) => T;