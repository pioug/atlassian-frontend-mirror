/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LozengeProps
 *
 * @codegen <<SignedSource::25dee9ab928c0059e43d176df9313264>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/lozenge/__generated__/index.partial.tsx <<SignedSource::e362dbb308b0f7785d47bb5e9aa46ab0>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformLozenge from '@atlaskit/lozenge';

type PlatformLozengeProps = React.ComponentProps<typeof PlatformLozenge>;

export type LozengeProps = Pick<
  PlatformLozengeProps,
  'appearance' | 'children' | 'isBold' | 'maxWidth' | 'testId'
>;

/**
 * A lozenge is a visual indicator used to highlight an item's status for quick recognition.
 *
 * @see [Lozenge](https://developer.atlassian.com/platform/forge/ui-kit/components/lozenge/) in UI Kit documentation for more information
 */
export type TLozenge<T> = (props: LozengeProps) => T;