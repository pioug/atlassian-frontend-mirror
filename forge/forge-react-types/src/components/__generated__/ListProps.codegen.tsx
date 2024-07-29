/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ListProps
 *
 * @codegen <<SignedSource::42008ff8ce0053ed906b5c3bf3571214>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/list/list.tsx <<SignedSource::15041a942a0c0a671c5d60df014ead74>>
 */
import React from 'react';

export interface ListProps {
	type: 'ordered' | 'unordered';
	children: React.ReactNode;
}