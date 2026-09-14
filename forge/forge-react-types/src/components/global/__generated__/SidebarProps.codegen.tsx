/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - Sidebar
 *
 * @codegen <<SignedSource::21330d4bd14edd1b9259c73077f6a70e>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::8b9e3202f2ee8ca910507da1f90eab00>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Sidebar.tsx <<SignedSource::c9a2ba78df204c3151ab41686a6066e0>>
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
	 * Accepts LinkMenuItem, ExpandableMenuItem, FlyOutMenuItem, ReorderableMenuItems, MenuSection and MenuSpacer components.
	 */
	children?: React.ReactElement | React.ReactElement[];
};

export type TSidebar<T> = (props: SidebarProps) => T;