/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TagProps
 *
 * @codegen <<SignedSource::64a8db0f512b7d60e2e35d1f99a001aa>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/tag/__generated__/index.partial.tsx <<SignedSource::f400241a2995fcf2cdb2c1eeaae198f7>>
 */
import React from 'react';
import { SimpleTag as PlatformSimpleTag } from '@atlaskit/tag';

type PlatformSimpleTagProps = React.ComponentProps<typeof PlatformSimpleTag>;

export type SimpleTagProps = Pick<
  PlatformSimpleTagProps,
  'text' | 'appearance' | 'color' | 'elemBefore' | 'testId'
>;