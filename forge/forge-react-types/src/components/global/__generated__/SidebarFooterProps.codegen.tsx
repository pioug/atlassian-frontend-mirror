/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - SidebarFooter
 *
 * @codegen <<SignedSource::c4d3ff770ff4dd3ee2e000e05dbab3ad>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::5ff0fb0e52f7acf5bd5c867bda1c333e>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/SidebarFooter.tsx <<SignedSource::a1c897ef3752e1ea2f3c33959a976b1a>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type SidebarFooterProps = {
	/**
	 * Accepts any content to render at the bottom of the sidebar, below the navigation items.
	 */
	children?: React.ReactNode;
};

export type TSidebarFooter<T> = (props: SidebarFooterProps) => T;