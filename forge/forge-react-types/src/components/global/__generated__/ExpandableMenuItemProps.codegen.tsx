/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - ExpandableMenuItem
 *
 * @codegen <<SignedSource::c0d15e6d9f41fbd47c72b0f6c76ca0df>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::c749a1bc5e1017e1bcbe09febba5a9a3>>
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