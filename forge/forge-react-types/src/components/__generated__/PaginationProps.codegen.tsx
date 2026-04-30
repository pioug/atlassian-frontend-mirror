/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - PaginationProps
 *
 * @codegen <<SignedSource::a17d1f43f1a5f40b39d3ca70391fd2ed>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/pagination/index.tsx <<SignedSource::c679ea4dcc10dee511a000d51ca66c9a>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformPagination from '@atlaskit/pagination';

type PlatformPaginationProps = React.ComponentProps<typeof PlatformPagination>;

export type PaginationProps = Pick<
	PlatformPaginationProps,
	| 'pages'
	| 'defaultSelectedIndex'
	| 'selectedIndex'
	| 'onChange'
	| 'max'
	| 'label'
	| 'nextLabel'
	| 'previousLabel'
	| 'pageLabel'
	| 'testId'
>;

/**
 * Pagination allows you to divide large amounts of content into chunks across multiple pages.
 *
 * @see [Pagination](https://developer.atlassian.com/platform/forge/ui-kit/components/pagination/) in UI Kit documentation for more information
 */
export type TPagination<T> = (props: PaginationProps) => T;