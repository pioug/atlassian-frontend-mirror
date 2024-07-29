/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BleedProps
 *
 * @codegen <<SignedSource::c20f03b9fb24ac003cdbb552d20ec657>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/bleed/__generated__/index.partial.tsx <<SignedSource::406ffef6715a3dff3aa10511e2ec232c>>
 */
import React from 'react';
import { Bleed as PlatformBleed } from '@atlaskit/primitives';

type PlatformBleedProps = React.ComponentProps<typeof PlatformBleed>;

export type BleedProps = Pick<
  PlatformBleedProps,
  'children' | 'all' | 'inline' | 'block' | 'testId' | 'role'
>;