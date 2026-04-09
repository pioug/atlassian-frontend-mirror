/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - Global
 *
 * @codegen <<SignedSource::a8e81abb12fa154730f041c5fcea562a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::c749a1bc5e1017e1bcbe09febba5a9a3>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global.tsx <<SignedSource::b4500860438e817a62661edd6326b5e5>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type GlobalProps = {
	/**
	 * Accepts CreateButton, HelpLink, Sidebar and Main components as children.
	 */
	children?: React.ReactElement | React.ReactElement[];
};

export type TGlobal<T> = (props: GlobalProps) => T;