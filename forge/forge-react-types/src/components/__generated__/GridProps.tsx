/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - GridProps
 *
 * @codegen <<SignedSource::097f3af17546735aac80cf542f51d61b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/grid/__generated__/index.partial.tsx <<SignedSource::2d697df76d89f0198e340dbf8b3ea0b7>>
 */
import React from 'react';
import { Grid as PlatformGrid } from '@atlaskit/primitives';

type PlatformGridProps = React.ComponentProps<typeof PlatformGrid>;

export type GridProps = Pick<
  PlatformGridProps,
  'children' | 'justifyContent' | 'justifyItems' | 'alignItems' | 'alignContent' | 'columnGap' | 'gap' | 'rowGap' | 'autoFlow' | 'templateRows' | 'templateColumns' | 'id' | 'testId' | 'role'
>;