/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - Global
 *
 * @codegen <<SignedSource::9aea526029f99f643d08f68e4ca78c81>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::aab578f2ba0895fc1b3cb93dbae44c0f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global.tsx <<SignedSource::9aee7c039455fb759450cd9337e29685>>
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