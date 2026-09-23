/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - Sidebar
 *
 * @codegen <<SignedSource::616f3d016bfc38cce860faebfdb603c0>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::5ff0fb0e52f7acf5bd5c867bda1c333e>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Sidebar.tsx <<SignedSource::ce06f2803b588cea4728d1bf487a6928>>
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
	 * Accepts LinkMenuItem, ExpandableMenuItem, FlyOutMenuItem, ReorderableMenuItems, MenuSection, MenuSpacer and SidebarFooter components.
	 */
	children?: React.ReactElement | React.ReactElement[];
};

export type TSidebar<T> = (props: SidebarProps) => T;