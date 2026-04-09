/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - CreateMenuItem
 *
 * @codegen <<SignedSource::a931517b525edc40b4f26cc658aa3268>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::c749a1bc5e1017e1bcbe09febba5a9a3>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/CreateMenuItem.tsx <<SignedSource::d568a9366bd7492cba2463a202fa6668>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type CreateMenuItemProps = {
	/**
	 * The display label for the create menu item.
	 */
	label: string;
	/**
	 * The function to call when the create menu item is clicked.
	 */
	onClick: () => void;
};

export type TCreateMenuItem<T> = (props: CreateMenuItemProps) => T;