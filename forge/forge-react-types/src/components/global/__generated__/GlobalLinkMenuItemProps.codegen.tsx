/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - GlobalLinkMenuItem
 *
 * @codegen <<SignedSource::13f71ea4b4d387e48fef444bd10847f9>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::ad330a446ee260180d5b510c18b5e1c8>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global-LinkMenuItem.tsx <<SignedSource::e70effe0d4e0620246252b35abddb112>>
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