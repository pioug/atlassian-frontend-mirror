/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BreadcrumbsProps
 *
 * @codegen <<SignedSource::6c6926eec00e9c2feaf42a5f65e8e930>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/breadcrumbs/breadcrumbs.tsx <<SignedSource::33fdf711cf7f65f7f5b472284518a050>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformBreadcrumbs from '@atlaskit/breadcrumbs';

type PlatformBreadcrumbsProps = React.ComponentProps<typeof PlatformBreadcrumbs>;

export type BreadcrumbsProps = Pick<
	PlatformBreadcrumbsProps,
	| 'defaultExpanded'
	| 'isExpanded'
	| 'maxItems'
	| 'itemsBeforeCollapse'
	| 'itemsAfterCollapse'
	| 'onExpand'
	| 'children'
	| 'label'
	| 'ellipsisLabel'
	| 'testId'
>;

/**
 * Breadcrumbs are a navigation system used to show a user's location in a site or app.
 *
 * @see [Breadcrumbs](https://developer.atlassian.com/platform/forge/ui-kit/components/breadcrumbs/) in UI Kit documentation for more information
 */
export type TBreadcrumbs<T> = (props: BreadcrumbsProps) => T;