/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ListItemProps
 *
 * @codegen <<SignedSource::928880135ab2561cd34cb8c8a239499d>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/list/listitem.tsx <<SignedSource::59f140607cfeb1b62827e9427cee94e0>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';

export interface ListItemProps {
	children: React.ReactNode;
}

export type TListItem<T> = (props: ListItemProps) => T;