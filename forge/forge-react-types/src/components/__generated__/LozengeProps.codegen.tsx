/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LozengeProps
 *
 * @codegen <<SignedSource::abe727d97158c4d16d13504ebd7f60d6>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/lozenge/__generated__/index.partial.tsx <<SignedSource::9799ca9fa788b29c08dfbdb778da62b4>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';


// Serialized type
type PlatformLozengeProps = {
  /**
	 * The appearance of the lozenge. Supports both legacy semantic appearances and new accent/semantic colors.
	 * Legacy appearances (default, success, removed, inprogress, new, moved) are automatically mapped to the new semantic colors.
	 */
	appearance?: 'default' | 'inprogress' | 'moved' | 'new' | 'removed' | 'success' | 'warning' | 'danger' | 'information' | 'neutral' | 'discovery' | 'accent-red' | 'accent-orange' | 'accent-yellow' | 'accent-lime' | 'accent-green' | 'accent-teal' | 'accent-blue' | 'accent-purple' | 'accent-magenta' | 'accent-gray';
  /**
	 * Elements to be rendered inside the lozenge. This should ideally be just a word or two.
	 */
	children?: React.ReactNode;
  /**
	 * Determines whether to apply the bold style or not.
	 * @deprecated This prop is deprecated and will be removed in an upcoming major release. Use Tag component for non-bold styles.
	 */
	isBold?: boolean;
  /**
	 * max-width of lozenge container. Default to 200px.
	 */
	maxWidth?: string | number;
  /**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
};

export type LozengeProps = Pick<
  PlatformLozengeProps,
  'appearance' | 'children' | 'isBold' | 'maxWidth' | 'testId'
>;

/**
 * A lozenge is a visual indicator used to highlight an item's status for quick recognition.
 *
 * @see [Lozenge](https://developer.atlassian.com/platform/forge/ui-kit/components/lozenge/) in UI Kit documentation for more information
 */
export type TLozenge<T> = (props: LozengeProps) => T;