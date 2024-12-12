/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ProgressBarProps
 *
 * @codegen <<SignedSource::3b95c77dc51e11040992d0b2bd139eaf>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/progressbar/__generated__/index.partial.tsx <<SignedSource::3451b31d9bf4f3a048e5a4143c69ba20>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformProgressBar from '@atlaskit/progress-bar';

type PlatformProgressBarProps = React.ComponentProps<typeof PlatformProgressBar>;

export type ProgressBarProps = Pick<
  PlatformProgressBarProps,
  'appearance' | 'ariaLabel' | 'isIndeterminate' | 'testId' | 'value'
>;