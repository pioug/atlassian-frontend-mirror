/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - GridProps
 *
 * @codegen <<SignedSource::07521208ceecb2f983ac27cfe7466068>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/grid/__generated__/index.partial.tsx <<SignedSource::60c78d870736339df6ff194f55503b37>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Grid as PlatformGrid } from '@atlaskit/primitives';

type PlatformGridProps = React.ComponentProps<typeof PlatformGrid>;

export type GridProps = Pick<
  PlatformGridProps,
  'children' | 'justifyContent' | 'justifyItems' | 'alignItems' | 'alignContent' | 'columnGap' | 'gap' | 'rowGap' | 'autoFlow' | 'templateRows' | 'templateColumns' | 'id' | 'testId' | 'role'
>;

/**
 * Primitives are token-backed low-level building blocks.
 */
export type TGrid<T> = (props: GridProps) => T;