/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - Sidebar
 *
 * @codegen <<SignedSource::feee23952eb932a49578c51095f16c74>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::c749a1bc5e1017e1bcbe09febba5a9a3>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Sidebar.tsx <<SignedSource::f6abab9890c10249756d7e8f73e34e85>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type SidebarProps = {
	/**
	 * URL path for the "For You" section in the sidebar.
	 * When provided, enables the "For You" navigation item.
	 */
	forYouUrl?: string;
	/**
	 * Accepts LinkMenuItem, ExpandableMenuItem and FlyOutMenuItem components.
	 */
	children?: React.ReactElement | React.ReactElement[];
};

export type TSidebar<T> = (props: SidebarProps) => T;