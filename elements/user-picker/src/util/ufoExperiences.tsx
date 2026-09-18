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

export class UfoErrorBoundary extends React.Component<React.PropsWithChildren<{ id: string }>> {
	componentDidCatch(): void {
		const instance = userPickerRenderedUfoExperience.getInstance(this.props.id);
		if (instance.state.id !== UFOExperienceState.FAILED.id) {
			instance.failure();
		}
	}

	render(): React.ReactNode {
		return this.props.children;
	}
}
