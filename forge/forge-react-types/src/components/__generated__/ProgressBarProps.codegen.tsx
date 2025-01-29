/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ProgressBarProps
 *
 * @codegen <<SignedSource::311fb087e468c54b326bbb425bd62594>>
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
 */
export type TProgressBar<T> = (props: ProgressBarProps) => T;