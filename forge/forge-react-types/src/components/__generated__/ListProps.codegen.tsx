/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ListProps
 *
 * @codegen <<SignedSource::80f168be93a61bc21c0b297b2d10885d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/list/list.tsx <<SignedSource::7f49ec36996a3c002f6eed821ae9e6b1>>
 */
import React from 'react';

export interface ListProps {
  type: 'ordered' | 'unordered';
  children: React.ReactNode;
}