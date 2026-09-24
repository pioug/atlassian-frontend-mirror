/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BreadcrumbsProps
 *
 * @codegen <<SignedSource::827c12ac6cf876531ed01494bca25adc>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/breadcrumbs/breadcrumbs.tsx <<SignedSource::1113a01d9130f99ad32a33a8b7c94efd>>
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