/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - FlyOutMenuItem
 *
 * @codegen <<SignedSource::4d03454d09bc7378f97365acaebe210d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::aab578f2ba0895fc1b3cb93dbae44c0f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/FlyOutMenuItem.tsx <<SignedSource::75d879bd2f49ca97e971242cb58cf034>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type FlyOutMenuItemProps = {
	/**
	 * The display label for the expandable menu item.
	 */
	label: string;
	/**
	 * Should contain FlyoutMenuItemTrigger and FlyoutMenuItemContent
	 */
	children: React.ReactElement | React.ReactElement[];
};

export type TFlyOutMenuItem<T> = (props: FlyOutMenuItemProps) => T;