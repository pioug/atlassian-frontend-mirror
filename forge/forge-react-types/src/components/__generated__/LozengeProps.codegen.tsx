/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LozengeProps
 *
 * @codegen <<SignedSource::124c3fee7b3b54f219fff9af433b06e5>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/lozenge/__generated__/index.partial.tsx <<SignedSource::c83364d769b7168eaaa21f1694e35702>>
 */
import React from 'react';
import PlatformLozenge from '@atlaskit/lozenge';

type PlatformLozengeProps = React.ComponentProps<typeof PlatformLozenge>;

export type LozengeProps = Pick<
  PlatformLozengeProps,
  'appearance' | 'children' | 'isBold' | 'maxWidth' | 'testId'
>;