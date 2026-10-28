/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - HelpButton
 *
 * @codegen <<SignedSource::ed934a0890846c5ad189d80f4fbf62e6>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::ceafcbb0ae1d61a2ac66f44a0d3090fa>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/HelpButton.tsx <<SignedSource::f8430dbd0003a516f51b9490ce2d7455>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type HelpButtonProps = {
	/**
	 * Called when the help button is clicked. Use this to show help content inside the app, for
	 * example by opening a panel.
	 */
	onClick: () => void;
	/**
	 * Renders the help button in its selected state, for example while the help content opened from
	 * `onClick` is showing.
	 */
	isSelected?: boolean;
};

export type THelpButton<T> = (props: HelpButtonProps) => T;