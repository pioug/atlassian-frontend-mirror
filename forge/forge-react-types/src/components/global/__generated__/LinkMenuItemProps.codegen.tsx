/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - LinkMenuItem
 *
 * @codegen <<SignedSource::f258365f78ad3bfc6985f97bfdcd145b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::3217debf5ba68e84ca5ef7cdbf6ebb43>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/LinkMenuItem.tsx <<SignedSource::90587dd6e35100556a9dbb8525b7c8e5>>
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
	 * The name of the icon to display before the label. If omitted, a default icon is used.
	 */
	icon?: IconProps['glyph'];
	/**
	 * Route-path pattern(s) that highlight this item when the current
	 * route matches, written relative to the app root.
	 */
	activePath?: string | string[];
};

export type TLinkMenuItem<T> = (props: LinkMenuItemProps) => T;