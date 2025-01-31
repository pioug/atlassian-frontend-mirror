/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - StackProps
 *
 * @codegen <<SignedSource::0e61f7285631ab35f3a77bb1d42d43aa>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/stack/__generated__/index.partial.tsx <<SignedSource::63880622ee058ba54ea3754cbc1910f4>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Stack as PlatformStack } from '@atlaskit/primitives';

type PlatformStackProps = React.ComponentProps<typeof PlatformStack>;

export type StackProps = Pick<
  PlatformStackProps,
  'children' | 'alignBlock' | 'alignInline' | 'grow' | 'space' | 'spread' | 'testId'
>;

/**
 * Primitives are token-backed low-level building blocks.
 */
export type TStack<T> = (props: StackProps) => T;