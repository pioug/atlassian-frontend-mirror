/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ProgressTrackerProps
 *
 * @codegen <<SignedSource::23a60b1bb4138183b2f8cc16df4000e3>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/progresstracker/__generated__/index.partial.tsx <<SignedSource::889025b24913a7379a30cc87547f6292>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type {
  ProgressTrackerProps as PlatformProgressTrackerProps,
  Stage as PlatformStage,
} from '@atlaskit/progress-tracker';

type Stage = Pick<
  PlatformStage,
  'id' | 'label' | 'percentageComplete' | 'status' | 'onClick'
>;

export type ProgressTrackerProps = Pick<
  PlatformProgressTrackerProps,
  'label' | 'testId'
> &
  Partial<Pick<PlatformProgressTrackerProps, 'animated' | 'spacing'>> & {
    items: Array<Stage>;
  };