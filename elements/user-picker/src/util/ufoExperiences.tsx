import React from 'react';

import { ConcurrentExperience } from '@atlaskit/ufo/concurrent-experience';
import { UFOExperienceState } from '@atlaskit/ufo/experience-state';
import { ExperiencePerformanceTypes, ExperienceTypes } from '@atlaskit/ufo/experience-types';

export const userPickerRenderedUfoExperience: ConcurrentExperience = new ConcurrentExperience(
	'user-picker-rendered',
	{
		platform: { component: 'user-picker' },
		type: ExperienceTypes.Load,
		performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
	},
);

export const userPickerOptionsShownUfoExperience: ConcurrentExperience = new ConcurrentExperience(
	'user-picker-options-shown',
	{
		platform: { component: 'user-picker' },
		type: ExperienceTypes.Operation,
		performanceType: ExperiencePerformanceTypes.InlineResult,
	},
);

type Props = React.PropsWithChildren<{ id: string }>;

type State = {
	hasError: boolean;
	previousProps: Props;
};

export class UfoErrorBoundary extends React.Component<Props, State> {
	state: State = { hasError: false, previousProps: this.props };

	static getDerivedStateFromProps(props: Props, state: State): State | null {
		// Preserve the original boundary's retry on parent updates, even when children are memoized.
		// Error recovery uses the same props, so it must retain the fallback instead of retrying.
		return props !== state.previousProps ? { hasError: false, previousProps: props } : null;
	}

	static getDerivedStateFromError(): Partial<State> {
		return { hasError: true };
	}

	componentDidCatch(): void {
		const instance = userPickerRenderedUfoExperience.getInstance(this.props.id);
		if (instance.state.id !== UFOExperienceState.FAILED.id) {
			instance.failure();
		}
	}

	render(): React.ReactNode {
		return this.state.hasError ? null : this.props.children;
	}
}
