/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SpinnerProps
 *
 * @codegen <<SignedSource::108d6188d28cc7b7e79512b33d9b4bb3>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/spinner/__generated__/index.partial.tsx <<SignedSource::309b9820ed3451cfdc77160864e3040c>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformSpinner from '@atlaskit/spinner';

type PlatformSpinnerProps = React.ComponentProps<typeof PlatformSpinner>;

export type SpinnerProps = Pick<
  PlatformSpinnerProps,
  'appearance' | 'delay' | 'label' | 'size' | 'testId'
>;