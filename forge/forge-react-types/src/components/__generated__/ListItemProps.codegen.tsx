/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ListItemProps
 *
 * @codegen <<SignedSource::498ef4606a16b666a2b159d16dc69460>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/list/listitem.tsx <<SignedSource::73cdf1aa500fb4ffb5cbe4ecd40276a9>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';

export interface ListItemProps {
	children: React.ReactNode;
}

export type TListItem<T> = (props: ListItemProps) => T;