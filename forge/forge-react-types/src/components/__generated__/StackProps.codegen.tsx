/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - StackProps
 *
 * @codegen <<SignedSource::b7d1ae39888c2693e5fc459da4e5871f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/stack/__generated__/index.partial.tsx <<SignedSource::191f725f0992bea2117b07b99f6444de>>
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
 * A stack manages the vertical layout of direct children using flexbox.
 *
 * @see [Stack](https://developer.atlassian.com/platform/forge/ui-kit/components/stack/) in UI Kit documentation for more information
 */
export type TStack<T> = (props: StackProps) => T;