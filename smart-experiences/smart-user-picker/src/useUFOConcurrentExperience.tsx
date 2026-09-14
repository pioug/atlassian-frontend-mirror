import { useEffect, useState } from 'react';

import type { ConcurrentExperience } from '@atlaskit/ufo/concurrent-experience';
import { UFOExperienceState } from '@atlaskit/ufo/experience-state';

export const useUFOConcurrentExperience = (experience: ConcurrentExperience, id: string): void => {
	const experienceForId = experience.getInstance(id);

	// Equivalent to pre-mount initialization - replace with @atlaskit/ufo's
	// useUFOComponentExperience when it supports ConcurrentExperience.
	useState(() => {
		experienceForId.start();
	});

	// Replace with @atlaskit/ufo's <ExperienceSuccess> when it supports ConcurrentExperience
	useEffect(() => {
		if (experienceForId.state !== UFOExperienceState['FAILED']) {
			experienceForId.success();
		}
		return () => {
			if (
				[UFOExperienceState['STARTED'], UFOExperienceState['IN_PROGRESS']].includes(
					experienceForId.state,
				)
			) {
				experienceForId.abort();
			}
		};

		// We only want this useEffect to run once after component mount, so no deps are needed.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
