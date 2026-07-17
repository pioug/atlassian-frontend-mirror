/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - LinkMenuItem
 *
 * @codegen <<SignedSource::d9092207b54fa34b82949a98201fd75a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::d821d76600ba855195ee3bae39f60532>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/LinkMenuItem.tsx <<SignedSource::e8537a207dee8f1515757f0e48027ca7>>
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
};

export type TLinkMenuItem<T> = (props: LinkMenuItemProps) => T;