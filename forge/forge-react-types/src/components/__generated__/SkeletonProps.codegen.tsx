/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SkeletonProps
 *
 * @codegen <<SignedSource::555897a4db07156f5119be3a6cec17ab>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/skeleton/index.tsx <<SignedSource::2ff67d2044a46a7d6f314edc0de5c6ec>>
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