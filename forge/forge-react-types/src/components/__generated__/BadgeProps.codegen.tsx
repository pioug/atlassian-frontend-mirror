/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BadgeProps
 *
 * @codegen <<SignedSource::c3ed8f1b656c7e1c4a9aad0919de3f7d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/badge/__generated__/index.partial.tsx <<SignedSource::89ad3341c1b8ef4b6fc93df162ac91d3>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformBadge from '@atlaskit/badge';

type _PlatformBadgeProps = React.ComponentProps<typeof PlatformBadge>;
export type PlatformBadgeProps = Omit<_PlatformBadgeProps, 'children'> & {
/**
 * The value displayed within the badge. A badge should only be used in cases where you want to represent a number. Use a lozenge for non-numeric information.
 * 
 * @type string | number
 */
	children?: _PlatformBadgeProps['children'];
}

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