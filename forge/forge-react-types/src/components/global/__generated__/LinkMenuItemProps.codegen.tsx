/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - LinkMenuItem
 *
 * @codegen <<SignedSource::62109dcfc1835ce979b975f84e9723bf>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::aab578f2ba0895fc1b3cb93dbae44c0f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/LinkMenuItem.tsx <<SignedSource::6cd2e6418fd76b15fec48eac7d5f8c00>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type LinkMenuItemProps = {
	/**
	 * The display label for the menu item.
	 */
	label: string;
	/**
	 * The URL path to navigate to when clicked.
	 */
	href: string;
};

export type TLinkMenuItem<T> = (props: LinkMenuItemProps) => T;