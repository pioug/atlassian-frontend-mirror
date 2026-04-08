/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - HelpLink
 *
 * @codegen <<SignedSource::7f8a5aa2f4e6c5d08ffea9f3d7127e82>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::aab578f2ba0895fc1b3cb93dbae44c0f>>
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