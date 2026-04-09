/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - HelpLink
 *
 * @codegen <<SignedSource::a155b0d8f06303a1f2a22b46f07b871f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::c749a1bc5e1017e1bcbe09febba5a9a3>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/HelpLink.tsx <<SignedSource::29aa1d2a5f3e491361497d3aa48fdade>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type HelpLinkProps = {
	/**
	 * URL linking to external documentation. Opens in a new tab.
	 */
	href: string;
};

export type THelpLink<T> = (props: HelpLinkProps) => T;