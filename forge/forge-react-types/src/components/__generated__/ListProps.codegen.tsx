/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ListProps
 *
 * @codegen <<SignedSource::fd5b4a75262f77b460d434e1c57d8ba1>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/list/list.tsx <<SignedSource::5bb6824f9a98335ce4b0fcdd02f71802>>
 */
import React from 'react';

export interface ListProps {
	type: 'ordered' | 'unordered';
	children: React.ReactNode;
}