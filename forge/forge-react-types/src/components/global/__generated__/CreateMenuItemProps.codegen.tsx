/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - CreateMenuItem
 *
 * @codegen <<SignedSource::daac4d901bdcbbb171b78c01a22e8db7>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::aab578f2ba0895fc1b3cb93dbae44c0f>>
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