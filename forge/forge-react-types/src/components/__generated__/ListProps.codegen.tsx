/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ListProps
 *
 * @codegen <<SignedSource::3db8e5739c51dccf55f9877eb24aa8e9>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/list/list.tsx <<SignedSource::e4bc24ae5e66e3583cb5fd2c9ba576df>>
 */
import React from 'react';

export interface ListProps {
  type: 'ordered' | 'unordered';
  children: React.ReactNode;
}