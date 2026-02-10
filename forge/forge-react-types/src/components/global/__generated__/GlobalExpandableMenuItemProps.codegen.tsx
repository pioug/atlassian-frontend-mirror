/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - GlobalExpandableMenuItem
 *
 * @codegen <<SignedSource::5cc168904578780ba265e1ad2fc3cfec>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::f24c6db68c9118776491952640ba616f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global-ExpandableMenuItem.tsx <<SignedSource::79df02babb605094ae73bdd0c00c7156>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type GlobalExpandableMenuItemProps = {
	/**
	 * The display label for the expandable menu item.
	 */
	label: string;
};

export type TGlobalExpandableMenuItem<T> = (props: GlobalExpandableMenuItemProps) => T;