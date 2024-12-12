/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ListProps
 *
 * @codegen <<SignedSource::e5d3409e37e543116ea009ca173ec496>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/list/list.tsx <<SignedSource::15041a942a0c0a671c5d60df014ead74>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';

export interface ListProps {
	type: 'ordered' | 'unordered';
	children: React.ReactNode;
}