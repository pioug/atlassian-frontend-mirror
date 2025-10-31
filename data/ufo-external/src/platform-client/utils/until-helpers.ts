import { ufolog } from '../../logger';
import { type ExperienceData } from '../../types';
import { type UFOExperience, UFOExperienceState } from '../core';
import type { UFOExperienceStateType } from '../core/experience/experience-state';

type UntilExperience = { experience: UFOExperience };
type UntilCategory = { category: string };

type UntilDefinition = UntilExperience | UntilCategory;

const isUntilExperience = (until: UntilDefinition): until is UntilExperience => {
	return (until as UntilExperience).experience !== undefined;
};

const isUntilCategory = (until: UntilDefinition): until is UntilCategory => {
	return (until as UntilCategory).category !== undefined;
};

export type UntilAllArgs = Array<UntilDefinition>;

export const untilAll = (deps: UntilAllArgs) => () => {
	const notMet = [...deps];
	return (
		data: ExperienceData,
	):
		| {
				done: boolean;
				state: UFOExperienceStateType;
		  }
		| {
				done: boolean;
				state?: undefined;
		  } => {
		if (notMet.length > 0) {
			const doneIndexes = notMet.reduce((acc: Array<number>, dep, i) => {
				// validation logic
				if (isUntilExperience(dep) && dep.experience.uuid === data.uuid) {
					acc.push(i);
				} else if (isUntilCategory(dep) && dep.category === data.category) {
					acc.push(i);
				}
				return acc;
			}, []);

			const priorityStateFound =
				data.state === UFOExperienceState.ABORTED || data.state === UFOExperienceState.FAILED;

			if (priorityStateFound) {
				notMet.length = 0;
				return {
					done: true,
					state: data.state,
				};
			}

			doneIndexes.reverse().forEach((i) => {
				notMet.splice(i, 1);
			});

			ufolog('untilAll deps left:', notMet.length, notMet);
			if (notMet.length === 0) {
				return {
					done: true,
					state: UFOExperienceState.SUCCEEDED,
				};
			}
		}

		return {
			done: false,
		};
	};
};
