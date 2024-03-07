/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - InlineProps
 *
 * @codegen <<SignedSource::d90fb1f3e0d865b0aa6d0c92536144ef>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/inline/__generated__/index.partial.tsx <<SignedSource::b6a1937f9464fe0c62c63c39b349815b>>
 */
import React from 'react';
import { Inline as PlatformInline } from '@atlaskit/primitives';

type PlatformInlineProps = React.ComponentProps<typeof PlatformInline>;

export type InlineProps = Pick<
  PlatformInlineProps,
  'children' | 'alignBlock' | 'alignInline' | 'spread' | 'space' | 'shouldWrap' | 'separator' | 'rowSpace' | 'testId'
>;