/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generated prop types for Global component - MenuSection
 *
 * @codegen <<SignedSource::b0bccf91caff72e98af168a12e359f71>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen-global
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/types/global-component-props.ts <<SignedSource::3217debf5ba68e84ca5ef7cdbf6ebb43>>
 * @codegenDependency ../../../../../../../services/forge-common-app-gateway/src/components/global/MenuSection.tsx <<SignedSource::4b13c71c5aaf9e4c58c05510ae16359f>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type MenuSectionProps = {
	/**
	 * The heading displayed above the grouped items. When omitted, the section
	 * groups its items without a visible heading.
	 */
	label?: string;
	/**
	 * Accepts LinkMenuItem, ExpandableMenuItem and ReorderableMenuItems components.
	 */
	children: React.ReactElement | React.ReactElement[];
};

export type TMenuSection<T> = (props: MenuSectionProps) => T;