/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - GlobalSidebar
 *
 * @codegen <<SignedSource::2e9345246b57199aa34c90c2d697b45c>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::f24c6db68c9118776491952640ba616f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global-Sidebar.tsx <<SignedSource::79c613be77297a86b70005750a4b0220>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type GlobalSidebarProps = {
	/**
	 * URL path for the "For You" section in the sidebar.
	 * When provided, enables the "For You" navigation item.
	 */
	forYouUrl?: string | undefined;
};

export type TGlobalSidebar<T> = (props: GlobalSidebarProps) => T;