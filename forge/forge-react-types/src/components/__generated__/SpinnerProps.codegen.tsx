/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SpinnerProps
 *
 * @codegen <<SignedSource::dd5606aeca1f0ad78ac7b8e188cc857d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/spinner/__generated__/index.partial.tsx <<SignedSource::309b9820ed3451cfdc77160864e3040c>>
 */
import React from 'react';
import PlatformSpinner from '@atlaskit/spinner';

type PlatformSpinnerProps = React.ComponentProps<typeof PlatformSpinner>;

export type SpinnerProps = Pick<
  PlatformSpinnerProps,
  'appearance' | 'delay' | 'label' | 'size' | 'testId'
>;