/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BleedProps
 *
 * @codegen <<SignedSource::c7fc1c22894c170849e24bf5e8171def>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/bleed/__generated__/index.partial.tsx <<SignedSource::a2cfcd6831a7e1c773ef12a09fc07228>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Bleed as PlatformBleed } from '@atlaskit/primitives';

type PlatformBleedProps = React.ComponentProps<typeof PlatformBleed>;

export type BleedProps = Pick<
  PlatformBleedProps,
  'children' | 'all' | 'inline' | 'block' | 'testId' | 'role'
>;

/**
 * Primitives are token-backed low-level building blocks.
 */
export type TBleed<T> = (props: BleedProps) => T;