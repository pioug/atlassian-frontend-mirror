/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - GlobalExpandableMenuItem
 *
 * @codegen <<SignedSource::8780871b323d0ecd390c334b279f4c5c>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::ad330a446ee260180d5b510c18b5e1c8>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global-ExpandableMenuItem.tsx <<SignedSource::70ca291a86897077f42eb7af58f709b1>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type GlobalExpandableMenuItemProps = {
	/**
	 * The display label for the expandable menu item.
	 */
	label: string;
	/**
	 * Accepts LinkMenuItem components.
	 */
	children: React.ReactElement | React.ReactElement[];
};

export type TGlobalExpandableMenuItem<T> = (props: GlobalExpandableMenuItemProps) => T;