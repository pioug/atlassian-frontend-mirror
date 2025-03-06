/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ListProps
 *
 * @codegen <<SignedSource::400e8f876b65d0f5902e544922d64a54>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/list/list.tsx <<SignedSource::08290162e7f9e2a672b27cec286206cf>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';

export interface ListProps {
	/**
	 * The `ordered` type should be used when representing an ordered list of items.
	 * The `unordered` type should be used when representing an unordered list of items.
	 * The type is set to `unordered` by default.
	 */
	type: 'ordered' | 'unordered';
	/**
	 * The items to render inside a `List` group.
	 */
	children: React.ReactNode;
}

/**
 * An unordered (bulleted) or ordered (numbered) list.
 */
export type TList<T> = (props: ListProps) => T;