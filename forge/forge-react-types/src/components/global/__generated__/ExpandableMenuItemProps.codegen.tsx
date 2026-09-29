/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - ExpandableMenuItem
 *
 * @codegen <<SignedSource::09e0613c4b37badae43e16f5950d2dd8>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::c749a1bc5e1017e1bcbe09febba5a9a3>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/ExpandableMenuItem.tsx <<SignedSource::42e91b3439f22096ddac998355428c7e>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type ExpandableMenuItemProps = {
	/**
	 * The display label for the expandable menu item.
	 */
	label: string;
	/**
	 * Accepts LinkMenuItem and ExpandableMenuItem components.
	 * Nesting is supported up to 3 levels deep
	 */
	children: React.ReactElement | React.ReactElement[];
};

export type TExpandableMenuItem<T> = (props: ExpandableMenuItemProps) => T;