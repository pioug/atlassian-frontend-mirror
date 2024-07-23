/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ListProps
 *
 * @codegen <<SignedSource::c486eb8eaa6f4cfee0b07387f31ddac5>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/list/list.tsx <<SignedSource::15041a942a0c0a671c5d60df014ead74>>
 */
import React from 'react';

export interface ListProps {
	type: 'ordered' | 'unordered';
	children: React.ReactNode;
}