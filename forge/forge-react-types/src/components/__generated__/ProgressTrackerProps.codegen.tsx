/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ProgressTrackerProps
 *
 * @codegen <<SignedSource::0a2bf5eca7d9abfb126dc2616f730a4d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/progresstracker/__generated__/index.partial.tsx <<SignedSource::a7e0b4cbec7b46d448729fbbe260ae77>>
 */
import type { ProgressTrackerProps as PlatformProgressTrackerProps, Stage as PlatformStage } from '@atlaskit/progress-tracker';

type Stage = Pick<PlatformStage, 'id' | 'label' | 'percentageComplete' | 'status' | 'onClick'>

export type ProgressTrackerProps = Pick<
  PlatformProgressTrackerProps,
  'animated' | 'label' | 'spacing' | 'testId'
  > & {
  items: Array<Stage>
};