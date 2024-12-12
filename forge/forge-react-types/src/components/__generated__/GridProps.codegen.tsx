/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - GridProps
 *
 * @codegen <<SignedSource::8a5601912d185e44dd0117a26cc43247>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/grid/__generated__/index.partial.tsx <<SignedSource::df3f85f752c7a4be02ee62114c5506b2>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Grid as PlatformGrid } from '@atlaskit/primitives';

type PlatformGridProps = React.ComponentProps<typeof PlatformGrid>;

export type GridProps = Pick<
  PlatformGridProps,
  'children' | 'justifyContent' | 'justifyItems' | 'alignItems' | 'alignContent' | 'columnGap' | 'gap' | 'rowGap' | 'autoFlow' | 'templateRows' | 'templateColumns' | 'id' | 'testId' | 'role'
>;