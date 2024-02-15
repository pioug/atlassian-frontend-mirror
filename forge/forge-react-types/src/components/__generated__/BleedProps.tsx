/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BleedProps
 *
 * @codegen <<SignedSource::c664393342a11cfe3e6981ec48d7624b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/bleed/__generated__/index.partial.tsx <<SignedSource::a689d813580adfbbe9b5e58254807b1d>>
 */
import React from 'react';
import { Bleed as PlatformBleed } from '@atlaskit/primitives';

type PlatformBleedProps = React.ComponentProps<typeof PlatformBleed>;

export type BleedProps = Pick<
  PlatformBleedProps,
  'children' | 'all' | 'inline' | 'block' | 'testId' | 'role'
>;