/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - InlineProps
 *
 * @codegen <<SignedSource::f154fd7caa18fc53a1369bb9f496909c>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/inline/__generated__/index.partial.tsx <<SignedSource::6f1af1d5438263ed1f6833c78c741ed9>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Inline as PlatformInline } from '@atlaskit/primitives';

type PlatformInlineProps = React.ComponentProps<typeof PlatformInline>;

export type InlineProps = Pick<
  PlatformInlineProps,
  'children' | 'alignBlock' | 'alignInline' | 'spread' | 'grow' | 'space' | 'shouldWrap' | 'separator' | 'rowSpace' | 'testId'
>;

/**
 * Primitives are token-backed low-level building blocks.
 */
export type TInline<T> = (props: InlineProps) => T;