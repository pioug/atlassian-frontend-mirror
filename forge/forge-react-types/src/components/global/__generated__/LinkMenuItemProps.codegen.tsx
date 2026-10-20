/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - LinkMenuItem
 *
 * @codegen <<SignedSource::a10c37fad93309b9f5d396ff929c4fc5>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::956ce4482c6294788d7a91427e49339f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/LinkMenuItem.tsx <<SignedSource::cae404dac1ec8c8d945dad5c5e62a065>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { IconProps } from '../../__generated__/IconProps.codegen';

export type LinkMenuItemProps = {
	/**
	 * The display label for the menu item.
	 */
	label: string;
	/**
	 * The URL path to navigate to when clicked.
	 */
	href: string;
	/**
	 * The icon to display before the label. Accepts either a UI Kit icon glyph name, or an image source:
	 * a local app asset, a hosted URL (its host must be declared in `permissions.external.images` in the
	 * app manifest), a data URI, or a root-relative path. If omitted, a default icon is used.
	 */
	icon?: IconProps['glyph'] | string;
	/**
	 * The icon to display instead of `icon` when dark mode is selected. Accepts the same values as `icon`
	 * and follows the same rules. If omitted, `icon` is also used in dark mode.
	 */
	iconDark?: IconProps['glyph'] | string;
	/**
	 * Route-path pattern(s) that highlight this item when the current
	 * route matches, written relative to the app root.
	 */
	activePath?: string | string[];
};

export type TLinkMenuItem<T> = (props: LinkMenuItemProps) => T;