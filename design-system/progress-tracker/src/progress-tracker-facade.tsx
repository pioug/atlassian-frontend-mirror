/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';

import OldProgressTracker, {
	type ProgressTrackerProps as OldProgressTrackerProps,
} from './progress-tracker';
import NewProgressTracker, {
	type ProgressTrackerProps as NewProgressTrackerProps,
} from './progress-tracker-new';

type ProgressTrackerProps = NewProgressTrackerProps | OldProgressTrackerProps;

/**
 * `ProgressTrackerFacade` is a component that conditionally renders either a new functional ProgressTracker component or
 *  class based ProgressTracker component based on a feature flag.
 *
 */
export const ProgressTrackerFacade = ({ ...props }: ProgressTrackerProps) => {
	const useNewProgressTracker = fg('platform-progress-tracker-functional-facade');

	return useNewProgressTracker ? (
		<NewProgressTracker {...(props as NewProgressTrackerProps)} />
	) : (
		<OldProgressTracker {...(props as OldProgressTrackerProps)} />
	);
};

export default ProgressTrackerFacade;
