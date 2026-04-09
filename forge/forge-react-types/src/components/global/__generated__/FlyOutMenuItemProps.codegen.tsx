/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - FlyOutMenuItem
 *
 * @codegen <<SignedSource::0cf7d558f9355a704b55f09b99fd7019>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::c749a1bc5e1017e1bcbe09febba5a9a3>>
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