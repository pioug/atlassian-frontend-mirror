/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SkeletonProps
 *
 * @codegen <<SignedSource::bdb7f8950691912f82536efb4c533f17>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/skeleton/index.tsx <<SignedSource::063533b56b514ce5d50e13ca77c922c0>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformSkeleton from '@atlaskit/skeleton';

export type BorderRadius =
	| 'radius.xsmall'
	| 'radius.small'
	| 'radius.medium'
	| 'radius.large'
	| 'radius.xlarge'
	| 'radius.xxlarge'
	| 'radius.full'
	| 'radius.tile';
type PlatformSkeletonProps = React.ComponentProps<typeof PlatformSkeleton>;

export type SkeletonProps = Pick<
	PlatformSkeletonProps,
	'width' | 'height' | 'isShimmering' | 'groupName' | 'testId'
> & {
	/**
	 * Controls the border radius, or rounding of the skeleton's corners.
	 */
	borderRadius?: BorderRadius;
};

/**
 * A skeleton acts as a placeholder for content, usually while the content loads.
 *
 * @see [Skeleton](https://developer.atlassian.com/platform/forge/ui-kit/components/skeleton/) in UI Kit documentation for more information
 */
export type TSkeleton<T> = (props: SkeletonProps) => T;