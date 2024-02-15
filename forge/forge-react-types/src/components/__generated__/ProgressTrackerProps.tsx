/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ProgressTrackerProps
 *
 * @codegen <<SignedSource::b35c8ca1999030c10a1fea495bb398e9>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/progresstracker/__generated__/index.partial.tsx <<SignedSource::598c5711a318ef043936375347ba7f1d>>
 */
import type { ProgressTrackerProps as PlatformProgressTrackerProps, Stage as PlatformStage } from '@atlaskit/progress-tracker';

type Stage = Pick<PlatformStage, 'id' | 'label' | 'percentageComplete' | 'status' | 'onClick'>

export type ProgressTrackerProps = Pick<
  PlatformProgressTrackerProps,
  'animated' | 'label' | 'spacing' | 'testId'
  > & {
  items: Array<Stage>
};