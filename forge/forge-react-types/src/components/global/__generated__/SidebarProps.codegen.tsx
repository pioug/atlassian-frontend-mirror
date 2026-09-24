/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - Sidebar
 *
 * @codegen <<SignedSource::a03e12dbef9bc425b4ec229871b191af>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::674f8242f5ec8e63fcd8dc4d91db1a6c>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Sidebar.tsx <<SignedSource::25c28ccf09cc54ba3b32860f0e5f7362>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type SidebarProps = {
	/**
	 * Controls whether the built-in For you navigation item is displayed.
	 * Defaults to true.
	 */
	forYouMenuItem?: boolean;
	/**
	 * Accepts LinkMenuItem, ExpandableMenuItem, FlyOutMenuItem, SearchableFlyoutMenuItems, ReorderableMenuItems, MenuSection, MenuSpacer and SidebarFooter components.
	 */
	children?: React.ReactElement | React.ReactElement[];
};

export type TSidebar<T> = (props: SidebarProps) => T;