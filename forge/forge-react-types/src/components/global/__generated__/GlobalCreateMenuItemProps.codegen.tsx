/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - GlobalCreateMenuItem
 *
 * @codegen <<SignedSource::3b912ff7a92b85d1b37c9b7371066a12>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::22a8bb81a36bca1a22c7a20a0fdb443f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global-CreateMenuItem.tsx <<SignedSource::ea07b98bbe5e33c969e04b10561963c6>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type GlobalCreateMenuItemProps = {
	/**
	 * The display label for the create menu item.
	 */
	label: string;
	/**
	 * The function to call when the create menu item is clicked.
	 */
	onClick: () => void;
};

export type TGlobalCreateMenuItem<T> = (props: GlobalCreateMenuItemProps) => T;