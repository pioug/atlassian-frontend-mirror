/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - Sidebar
 *
 * @codegen <<SignedSource::4e9b46686f659a994b41b5e948ace123>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::c749a1bc5e1017e1bcbe09febba5a9a3>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Sidebar.tsx <<SignedSource::82ff22e83c83968012f8de177239d386>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type SidebarProps = {
	/**
	 * Accepts LinkMenuItem, ExpandableMenuItem and FlyOutMenuItem components.
	 */
	children?: React.ReactElement | React.ReactElement[];
};

export type TSidebar<T> = (props: SidebarProps) => T;