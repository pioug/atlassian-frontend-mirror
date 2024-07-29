/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ProgressTrackerProps
 *
 * @codegen <<SignedSource::6379d7bdf1c5cda089abf5f50cbc3b01>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/progresstracker/__generated__/index.partial.tsx <<SignedSource::889025b24913a7379a30cc87547f6292>>
 */
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