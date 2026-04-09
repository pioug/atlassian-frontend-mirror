/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - PersonalSettingsItem
 *
 * @codegen <<SignedSource::47455d0b4bb5ac066f0570c5ee7af1ea>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::c749a1bc5e1017e1bcbe09febba5a9a3>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/PersonalSettingsItem.tsx <<SignedSource::230e1660e2c537351d8d467d8532a5cc>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type PersonalSettingsItemProps = {
	/**
	 * The display label for the personal settings item.
	 */
	label: string;
	/**
	 * An optional description shown below the label.
	 */
	description?: string;
	/**
	 * The function to call when the personal settings item is clicked.
	 */
	onClick: () => void;
};

export type TPersonalSettingsItem<T> = (props: PersonalSettingsItemProps) => T;