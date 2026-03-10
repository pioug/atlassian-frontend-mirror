/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - GlobalSidebar
 *
 * @codegen <<SignedSource::801b8c50439e535a59d02fc552de2ba6>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::22a8bb81a36bca1a22c7a20a0fdb443f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global-Sidebar.tsx <<SignedSource::cdeaedb1f8277703adc781e514cecf61>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type GlobalSidebarProps = {
	/**
	 * URL path for the "For You" section in the sidebar.
	 * When provided, enables the "For You" navigation item.
	 */
	forYouUrl?: string;
	/**
	 * Accepts Global.LinkMenuItem, Global.ExpandableMenuItem and Global.FlyOutMenuItem components.
	 */
	children?: React.ReactElement | React.ReactElement[];
};

export type TGlobalSidebar<T> = (props: GlobalSidebarProps) => T;