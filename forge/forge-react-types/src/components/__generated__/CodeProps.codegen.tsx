/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CodeProps
 *
 * @codegen <<SignedSource::77605e4d0066c4a04ebaed71d532f192>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/code/__generated__/code.partial.tsx <<SignedSource::7c44fc035da9da9e1dc10ad78f244bed>>
 */
import React from 'react';
import { Code as PlatformCode } from '@atlaskit/code';

type PlatformCodeProps = React.ComponentProps<typeof PlatformCode>;

export type CodeProps = Pick<
  PlatformCodeProps,
  'children' | 'testId'
>;