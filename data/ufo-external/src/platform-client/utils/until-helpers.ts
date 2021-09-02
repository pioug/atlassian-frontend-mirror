import { ufolog } from '../../logger';
import { ExperienceData } from '../../types/types';
import { UFOExperience, UFOExperienceState } from '../core';

type UntilExperience = { experience: UFOExperience };
type UntilCategory = { category: string };

type UntilDefinition = UntilExperience | UntilCategory;

const isUntilExperience = (
  until: UntilDefinition,
): until is UntilExperience => {
  return (until as UntilExperience).experience !== undefined;
};

const isUntilCategory = (until: UntilDefinition): until is UntilCategory => {
  return (until as UntilCategory).category !== undefined;
};

export type UntilAllArgs = Array<UntilDefinition>;

export const untilAll = (deps: UntilAllArgs) => () => {
  const notMet = [...deps];
  let finalState = null;
  return (data: ExperienceData) => {
    if (notMet.length > 0) {
      const doneIndexes = notMet.reduce((acc: Array<number>, dep, i) => {
        // validation logic
        if (isUntilExperience(dep) && dep.experience.id === data.id) {
          acc.push(i);
        } else if (isUntilCategory(dep) && dep.category === data.category) {
          acc.push(i);
        }
        return acc;
      }, []);

      const priorityStateFound =
        data.state === UFOExperienceState.ABORTED ||
        data.state === UFOExperienceState.FAILED;

      if (priorityStateFound) {
        notMet.length = 0;
        finalState = {
          done: true,
          state: data.state,
        };

        return finalState;
      }

      doneIndexes.reverse().forEach(i => {
        notMet.splice(i, 1);
      });

      ufolog('untilAll deps left:', notMet.length, notMet);
      if (notMet.length === 0) {
        finalState = {
          done: true,
          state: UFOExperienceState.SUCCEEDED,
        };
        return finalState;
      }
    }

    return {
      done: false,
    };
  };
};
