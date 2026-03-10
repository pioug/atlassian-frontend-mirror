/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - GlobalExpandableMenuItem
 *
 * @codegen <<SignedSource::adde83777ea00d1ebe1e2f1b4166aa17>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::22a8bb81a36bca1a22c7a20a0fdb443f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/Global-ExpandableMenuItem.tsx <<SignedSource::8600ea6c521d7fbc43864dafa22c4611>>
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