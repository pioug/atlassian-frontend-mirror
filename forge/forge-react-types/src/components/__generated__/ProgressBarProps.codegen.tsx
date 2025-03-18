/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ProgressBarProps
 *
 * @codegen <<SignedSource::e0050bb3ee946768c292e24b263334d1>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/progressbar/__generated__/index.partial.tsx <<SignedSource::aafdad776f93c659dc29fdb27eca9027>>
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