import React from 'react';

import { ExperiencePerformanceTypes, ExperienceTypes, ConcurrentExperience } from '@atlaskit/ufo';

export const mentionRenderedUfoExperience: ConcurrentExperience = new ConcurrentExperience(
	'mention-rendered',
	{
		platform: { component: 'mention' },
		type: ExperienceTypes.Load,
		performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
	},
);

export class UfoErrorBoundary extends React.Component<React.PropsWithChildren<{ id: string }>> {
	componentDidCatch(): void {
		mentionRenderedUfoExperience.getInstance(this.props.id).failure();
	}

	render(): React.ReactNode {
		return this.props.children;
	}
}
