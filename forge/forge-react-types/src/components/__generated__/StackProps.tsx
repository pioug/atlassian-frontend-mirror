/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - StackProps
 *
 * @codegen <<SignedSource::507f9c81b3fb617bbcea136d894f3565>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/stack/__generated__/index.partial.tsx <<SignedSource::635020db4aa96660ffc82bae2daf904b>>
 */
import React from 'react';
import { Stack as PlatformStack } from '@atlaskit/primitives';

type PlatformStackProps = React.ComponentProps<typeof PlatformStack>;

export type StackProps = Pick<
  PlatformStackProps,
  'children' | 'alignBlock' | 'alignInline' | 'grow' | 'space' | 'spread' | 'testId'
>;