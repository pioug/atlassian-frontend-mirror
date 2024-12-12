/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BleedProps
 *
 * @codegen <<SignedSource::cbd738c202b814d0103cb6fd54a2f2ad>>
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