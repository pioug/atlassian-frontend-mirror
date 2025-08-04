/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BadgeProps
 *
 * @codegen <<SignedSource::dded43c94e5bc997c5df041eeb253927>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/badge/__generated__/index.partial.tsx <<SignedSource::002a848f01b18a8dea0ea160d731edbf>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type PlatformBadgeProps = Omit<_PlatformBadgeProps, 'children'> & {
/**
 * The value displayed within the badge. A badge should only be used in cases where you want to represent a number. Use a lozenge for non-numeric information.
 * 
 * @type string | number
 */
	children?: _PlatformBadgeProps['children'];
}

// Serialized type
type _PlatformBadgeProps = {
  /**
	 * Affects the visual style of the badge.
	 */
	appearance?: 'added' | 'default' | 'important' | 'primary' | 'primaryInverted' | 'removed';
  
	children?: React.ReactNode;
  /**
	 * The maximum value to display. Defaults to `99`. If the value is 100, and max is 50, "50+" will be displayed.
	 * This value should be greater than 0. If set to `false` the original value will be displayed regardless of
	 * whether it is larger than the default maximum value.
	 */
	max?: number | false;
  /**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
	 */
	testId?: string;
};

export type BadgeProps = Pick<
  PlatformBadgeProps,
  'appearance' | 'children' | 'max' | 'testId'
>;

/**
 * A badge is a visual indicator for numeric values such as tallies and scores.
 *
 * @see [Badge](https://developer.atlassian.com/platform/forge/ui-kit/components/badge/) in UI Kit documentation for more information
 */
export type TBadge<T> = (props: BadgeProps) => T;