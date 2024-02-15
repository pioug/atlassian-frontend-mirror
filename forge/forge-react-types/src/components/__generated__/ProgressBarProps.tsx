/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ProgressBarProps
 *
 * @codegen <<SignedSource::5df6cdec216039dab18e0b063f2d35fd>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/progressbar/__generated__/index.partial.tsx <<SignedSource::2452df0bef1b28308e7c0f95d100570b>>
 */
import React from 'react';
import PlatformProgressBar from '@atlaskit/progress-bar';

type PlatformProgressBarProps = React.ComponentProps<typeof PlatformProgressBar>;

export type ProgressBarProps = Pick<
  PlatformProgressBarProps,
  'appearance' | 'ariaLabel' | 'isIndeterminate' | 'testId' | 'value'
>;