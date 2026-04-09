/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - LinkMenuItem
 *
 * @codegen <<SignedSource::ba80a20245324b98e40aa448a1955a8f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::c749a1bc5e1017e1bcbe09febba5a9a3>>
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