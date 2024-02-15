/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CodeProps
 *
 * @codegen <<SignedSource::d9b3839b321df26c210ca9963554a9b3>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/code/__generated__/code.partial.tsx <<SignedSource::fb6cd9ec17fcecf5fa2d0e39e9dc0f91>>
 */
import React from 'react';
import { Code as PlatformCode } from '@atlaskit/code';

type PlatformCodeProps = React.ComponentProps<typeof PlatformCode>;

export type CodeProps = Pick<
  PlatformCodeProps,
  'children' | 'testId'
>;