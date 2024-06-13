/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ListProps
 *
 * @codegen <<SignedSource::43df67cec0358c211c0d875be92482a1>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/list/list.tsx <<SignedSource::a1a578841ec142d0d84fe0bbcc6f08d8>>
 */
import React from 'react';

export interface ListProps {
	type: 'ordered' | 'unordered';
	children: React.ReactNode;
}