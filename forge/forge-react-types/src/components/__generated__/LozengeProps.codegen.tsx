/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LozengeProps
 *
 * @codegen <<SignedSource::0ef732d9e1b715ee6f4229d3ef5b4649>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/lozenge/__generated__/index.partial.tsx <<SignedSource::e362dbb308b0f7785d47bb5e9aa46ab0>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';


// Serialized type
type PlatformLozengeProps = {
  /**
	 * Elements to be rendered inside the lozenge. This should ideally be just a word or two.
	 */
	children?: React.ReactNode;
  /**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
  /**
	 * Determines whether to apply the bold style or not.
	 */
	isBold?: boolean;
  /**
	 * The appearance type.
	 */
	appearance?: 'default' | 'inprogress' | 'moved' | 'new' | 'removed' | 'success';
  /**
	 * max-width of lozenge container. Default to 200px.
	 */
	maxWidth?: string | number;
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