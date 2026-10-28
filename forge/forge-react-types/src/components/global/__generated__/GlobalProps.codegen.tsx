/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - Global
 *
 * @codegen <<SignedSource::872374574483b4e213f998a4e6e94a2a>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::ceafcbb0ae1d61a2ac66f44a0d3090fa>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global.tsx <<SignedSource::1ab47224b739d6e25fb9aea0b9d59e39>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type GlobalProps = {
	/**
	 * Accepts CreateButton, HelpButton, Sidebar and Main components as children.
	 */
	children?: React.ReactElement | React.ReactElement[];
	/**
	 * Hides the top navigation and side navigation so the app renders in the full viewport.
	 *
	 * Not supported for general use. This prop is temporary and may change or be removed without
	 * notice.
	 */
	unsupported_hideChrome?: boolean;
	/**
	 * Renders a lozenge next to the app name in the top navigation, for labelling the app's release
	 * stage. For example, `"Alpha"` or `"Beta"`.
	 *
	 * The text is truncated if it is too long, and the lozenge is hidden on smaller viewports.
	 *
	 * Not supported for general use. This prop is temporary and may change or be removed without
	 * notice.
	 */
	unsupported_appBadge?: string;
};

export type TGlobal<T> = (props: GlobalProps) => T;