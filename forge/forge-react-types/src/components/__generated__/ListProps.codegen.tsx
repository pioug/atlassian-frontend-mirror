/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ListProps
 *
 * @codegen <<SignedSource::7d265531e2264323e8b4261db3310c7c>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/list/list.tsx <<SignedSource::6532335ba48aaab56cd76a8f919dc2ab>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';

export interface ListProps {
	/**
	 * The items to render inside a `List` group.
	 */
	children: React.ReactNode;
	/**
	 * The `ordered` type should be used when representing an ordered list of items.
	 * The `unordered` type should be used when representing an unordered list of items.
	 * The type is set to `unordered` by default.
	 */
	type: 'ordered' | 'unordered';
}

/**
 * An unordered (bulleted) or ordered (numbered) list.
 *
 * @see [List](https://developer.atlassian.com/platform/forge/ui-kit/components/list/) in UI Kit documentation for more information
 */
export type TList<T> = (props: ListProps) => T;