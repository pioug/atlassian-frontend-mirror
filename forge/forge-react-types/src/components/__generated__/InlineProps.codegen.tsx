/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - InlineProps
 *
 * @codegen <<SignedSource::a184afd895391ad501b67ca2a5c49fc1>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/inline/__generated__/index.partial.tsx <<SignedSource::8123157b2afe19d52b47110fb754d43b>>
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
 * An inline manages the horizontal layout of direct children using flexbox.
 *
 * @see [Inline](https://developer.atlassian.com/platform/forge/ui-kit/components/inline/) in UI Kit documentation for more information
 */
export type TInline<T> = (props: InlineProps) => T;