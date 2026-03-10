/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - GlobalLinkMenuItem
 *
 * @codegen <<SignedSource::aed33634d0608a30b844a54d220a86b9>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::22a8bb81a36bca1a22c7a20a0fdb443f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global-LinkMenuItem.tsx <<SignedSource::f77a57d889edea059bd3359fb8ae99d6>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type GlobalLinkMenuItemProps = {
	/**
	 * The display label for the menu item.
	 */
	label: string;
	/**
	 * The URL path to navigate to when clicked.
	 */
	href: string;
};

export type TGlobalLinkMenuItem<T> = (props: GlobalLinkMenuItemProps) => T;