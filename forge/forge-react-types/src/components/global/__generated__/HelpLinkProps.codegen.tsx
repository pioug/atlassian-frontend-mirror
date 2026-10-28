/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - HelpLink
 *
 * @codegen <<SignedSource::5c34eedb5acba923d5e3d416ea8dce9c>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::ceafcbb0ae1d61a2ac66f44a0d3090fa>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/HelpLink.tsx <<SignedSource::e0846d82aa4448f7ec496b1f00f9a16d>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

/**
 * @deprecated Use `HelpButton` instead. If both are provided, `HelpButton` is rendered and
 * `HelpLink` is ignored.
 */
export type HelpLinkProps = {
	/**
	 * URL linking to external documentation. Opens in a new tab.
	 */
	href: string;
};

/**
 * @deprecated Use `HelpButton` instead. If both are provided, `HelpButton` is rendered and
 * `HelpLink` is ignored.
 */
export type THelpLink<T> = (props: HelpLinkProps) => T;