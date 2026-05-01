/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BleedProps
 *
 * @codegen <<SignedSource::a1982f7eb843934c3de3fd363503a5d4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/bleed/index.tsx <<SignedSource::2618d19d7707ea6758a8b5a558a725df>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Bleed as PlatformBleed } from '@atlaskit/primitives/compiled';

type PlatformBleedProps = React.ComponentProps<typeof PlatformBleed>;

export type BleedProps = Pick<PlatformBleedProps, 'all' | 'children' | 'inline' | 'block' | 'testId'>;

/**
 * Bleed allows child elements to visually extend beyond the bounds of their parent container.
 */
export type TBleed<T> = (props: BleedProps) => T;