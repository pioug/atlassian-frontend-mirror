/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - GlobalFlyOutMenuItem
 *
 * @codegen <<SignedSource::00cbf01089cf7630b3d532ee47662876>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::22a8bb81a36bca1a22c7a20a0fdb443f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global-FlyOutMenuItem.tsx <<SignedSource::847a3b22853bfdba7814dfc74eaf4102>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type GlobalFlyOutMenuItemProps = {
	/**
	 * The display label for the expandable menu item.
	 */
	label: string;
	/**
	 * Should contain FlyoutMenuItemTrigger and FlyoutMenuItemContent
	 */
	children: React.ReactElement | React.ReactElement[];
};

export type TGlobalFlyOutMenuItem<T> = (props: GlobalFlyOutMenuItemProps) => T;