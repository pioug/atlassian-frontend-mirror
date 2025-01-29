/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ProgressTrackerProps
 *
 * @codegen <<SignedSource::936e27b6592ef14e79d5fe0a336ceb81>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/progresstracker/__generated__/index.partial.tsx <<SignedSource::50d000e383a00beab96a51973f57c769>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type {
	ProgressTrackerProps as PlatformProgressTrackerProps,
	Stage as PlatformStage,
} from '@atlaskit/progress-tracker';

type Stage = Pick<PlatformStage, 'id' | 'label' | 'percentageComplete' | 'status' | 'onClick'>;

export type ProgressTrackerProps = Pick<PlatformProgressTrackerProps, 'label' | 'testId'> &
	Partial<Pick<PlatformProgressTrackerProps, 'animated' | 'spacing'>> & {
		items: Array<Stage>;
	};

/**
 * A progress tracker displays the steps and progress through a journey.
 */
export type TProgressTracker<T> = (props: ProgressTrackerProps) => T;