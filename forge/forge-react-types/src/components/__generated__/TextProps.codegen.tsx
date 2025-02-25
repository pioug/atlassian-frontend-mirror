/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextProps
 *
 * @codegen <<SignedSource::31d160b53a47008ce61df934652b99c0>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/text/__generated__/index.partial.tsx <<SignedSource::813a1a6f22d33e27a5651da301ca7ab1>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Text as PlatformText } from '@atlaskit/primitives';

type PlatformTextProps = React.ComponentProps<typeof PlatformText>;

export type TextProps = Pick<
  PlatformTextProps,
  'align' | 'as' | 'color' | 'maxLines' | 'size' | 'weight' | 'children' | 'testId'
>;

/**
 * Primitives are token-backed low-level building blocks.
 */
export type TText<T> = (props: TextProps) => T;