/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TagProps
 *
 * @codegen <<SignedSource::267268d3aa69a4b06f02e1cc5edea9ee>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/tag/__generated__/index.partial.tsx <<SignedSource::5eafca6673842204effb416681fb9ff4>>
 */
import React from 'react';
import { SimpleTag as PlatformSimpleTag } from '@atlaskit/tag';

type PlatformSimpleTagProps = React.ComponentProps<typeof PlatformSimpleTag>;

export type SimpleTagProps = Pick<
  PlatformSimpleTagProps,
  'text' | 'appearance' | 'color' | 'elemBefore' | 'href' | 'testId'
>;