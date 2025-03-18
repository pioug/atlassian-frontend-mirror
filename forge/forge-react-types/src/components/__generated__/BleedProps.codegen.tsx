/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BleedProps
 *
 * @codegen <<SignedSource::cc28f1caa57c117f8db064f643bfe56d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/bleed/__generated__/index.partial.tsx <<SignedSource::406ffef6715a3dff3aa10511e2ec232c>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Bleed as PlatformBleed } from '@atlaskit/primitives';

type PlatformBleedProps = React.ComponentProps<typeof PlatformBleed>;

export type BleedProps = Pick<
  PlatformBleedProps,
  'children' | 'all' | 'inline' | 'block' | 'testId' | 'role'
>;

export type TBleed<T> = (props: BleedProps) => T;