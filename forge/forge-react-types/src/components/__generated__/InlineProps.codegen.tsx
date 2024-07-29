/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - InlineProps
 *
 * @codegen <<SignedSource::7a77e88b65275715d5da157002ed5e89>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/inline/__generated__/index.partial.tsx <<SignedSource::b6a1937f9464fe0c62c63c39b349815b>>
 */
import React from 'react';
import { Inline as PlatformInline } from '@atlaskit/primitives';

type PlatformInlineProps = React.ComponentProps<typeof PlatformInline>;

export type InlineProps = Pick<
  PlatformInlineProps,
  'children' | 'alignBlock' | 'alignInline' | 'spread' | 'space' | 'shouldWrap' | 'separator' | 'rowSpace' | 'testId'
>;