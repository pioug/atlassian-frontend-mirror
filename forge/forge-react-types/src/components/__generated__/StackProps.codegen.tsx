/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - StackProps
 *
 * @codegen <<SignedSource::3cfe91010dd303f68443ac1956bba040>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/stack/__generated__/index.partial.tsx <<SignedSource::c2360fd1ad9e2cd87d47c640ad0158d2>>
 */
import React from 'react';
import { Stack as PlatformStack } from '@atlaskit/primitives';

type PlatformStackProps = React.ComponentProps<typeof PlatformStack>;

export type StackProps = Pick<
  PlatformStackProps,
  'children' | 'alignBlock' | 'alignInline' | 'grow' | 'space' | 'spread' | 'testId'
>;