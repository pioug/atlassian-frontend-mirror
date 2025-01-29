/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LozengeProps
 *
 * @codegen <<SignedSource::010c29755ec75417d1649af3008801cd>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/lozenge/__generated__/index.partial.tsx <<SignedSource::20810ed29278b94c2bf310c8d80efdf8>>
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
 */
export type TLozenge<T> = (props: LozengeProps) => T;