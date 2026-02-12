/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - GlobalExpandableMenuItem
 *
 * @codegen <<SignedSource::8f9bf63fd0127b4faa2986b9c9257182>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::ad330a446ee260180d5b510c18b5e1c8>>
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