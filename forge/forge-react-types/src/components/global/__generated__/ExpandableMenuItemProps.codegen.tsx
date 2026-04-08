/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - ExpandableMenuItem
 *
 * @codegen <<SignedSource::98d1be85f3f83a04923e2e1b59949b31>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::aab578f2ba0895fc1b3cb93dbae44c0f>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/ExpandableMenuItem.tsx <<SignedSource::554f1c54ee96d013c0112275732eb8fc>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type ExpandableMenuItemProps = {
	/**
	 * The display label for the expandable menu item.
	 */
	label: string;
	/**
	 * Accepts LinkMenuItem components.
	 */
	children: React.ReactElement | React.ReactElement[];
};

export type TExpandableMenuItem<T> = (props: ExpandableMenuItemProps) => T;