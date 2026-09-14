/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - Global
 *
 * @codegen <<SignedSource::4f134dd4ad247c109d1d74968a59bb38>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::3217debf5ba68e84ca5ef7cdbf6ebb43>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global.tsx <<SignedSource::b4211eca9dac23a616225ac8e136d31e>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type GlobalProps = {
	/**
	 * Accepts CreateButton, HelpLink, Sidebar and Main components as children.
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