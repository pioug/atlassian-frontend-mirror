/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ProgressBarProps
 *
 * @codegen <<SignedSource::b3f6cb6285df9baffc4710927319e5b0>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/progressbar/__generated__/index.partial.tsx <<SignedSource::236039890ee9a94642263136763f564f>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformProgressBar from '@atlaskit/progress-bar';

type PlatformProgressBarProps = React.ComponentProps<typeof PlatformProgressBar>;

export type ProgressBarProps = Pick<
  PlatformProgressBarProps,
  'appearance' | 'ariaLabel' | 'isIndeterminate' | 'testId' | 'value'
>;

/**
 * A progress bar communicates the status of a system process.
 *
 * @see [ProgressBar](https://developer.atlassian.com/platform/forge/ui-kit/components/progress-bar/) in UI Kit documentation for more information
 */
export type TProgressBar<T> = (props: ProgressBarProps) => T;