/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - GlobalCreateButton
 *
 * @codegen <<SignedSource::525c8d7c3a97ee2f3beb4c9dfd20e205>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::22a8bb81a36bca1a22c7a20a0fdb443f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global-CreateButton.tsx <<SignedSource::036971f69832edbd2150cec400d3d5da>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { GlobalCreateMenuItemProps } from './GlobalCreateMenuItemProps.codegen';

export type GlobalCreateButtonProps = {
	items: GlobalCreateMenuItemProps[];
};

export type TGlobalCreateButton<T> = (props: GlobalCreateButtonProps) => T;