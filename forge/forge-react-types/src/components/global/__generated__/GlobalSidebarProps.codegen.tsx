/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - GlobalSidebar
 *
 * @codegen <<SignedSource::79b07a090ede53f7e378c159fed3ac3b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::ad330a446ee260180d5b510c18b5e1c8>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global-Sidebar.tsx <<SignedSource::216e7ba54d02c3e167f084fb05e4018f>>
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
	 * Accepts Global.LinkMenuItem and Global.ExpandMenuItem components.
	 */
	children?: React.ReactElement | React.ReactElement[];
};

export type TGlobalSidebar<T> = (props: GlobalSidebarProps) => T;