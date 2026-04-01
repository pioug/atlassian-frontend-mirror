/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - Global
 *
 * @codegen <<SignedSource::9660b551dde5234db5e9336327d781e9>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::22a8bb81a36bca1a22c7a20a0fdb443f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global.tsx <<SignedSource::cc7025dcd3e4d2c612afa798d2a9ec3f>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type GlobalProps = {
	/**
	 * Accepts Global.CreateButton, Global.Sidebar and Global.Main components as children.
	 */
	children?: React.ReactElement | React.ReactElement[];
};

export type TGlobal<T> = (props: GlobalProps) => T;