import { UFOExperienceState, UFOExperienceStateType } from './experience-state';

const UFOStateAvailableTransitions = {
  [UFOExperienceState.NOT_STARTED.id]: [UFOExperienceState.STARTED.id],
  [UFOExperienceState.STARTED.id]: [
    UFOExperienceState.IN_PROGRESS.id,
    UFOExperienceState.BLOCKED.id,
    UFOExperienceState.SUCCEEDED.id,
    UFOExperienceState.SUCCEEDED_WAITING_FOR_DEPS.id,
    UFOExperienceState.FAILED.id,
    UFOExperienceState.ABORTED.id,
  ],
  [UFOExperienceState.IN_PROGRESS.id]: [
    UFOExperienceState.BLOCKED.id,
    UFOExperienceState.SUCCEEDED.id,
    UFOExperienceState.SUCCEEDED_WAITING_FOR_DEPS.id,
    UFOExperienceState.FAILED.id,
    UFOExperienceState.ABORTED.id,
  ],
  [UFOExperienceState.BLOCKED.id]: [
    UFOExperienceState.RECOVERED.id,
    UFOExperienceState.ABORTED.id,
  ],
  [UFOExperienceState.RECOVERED.id]: [
    UFOExperienceState.STARTED.id,
    UFOExperienceState.SUCCEEDED.id,
    UFOExperienceState.SUCCEEDED_WAITING_FOR_DEPS.id,
    UFOExperienceState.FAILED.id,
    UFOExperienceState.ABORTED.id,
  ],
  [UFOExperienceState.SUCCEEDED.id]: [UFOExperienceState.STARTED.id],
  [UFOExperienceState.SUCCEEDED_WAITING_FOR_DEPS.id]: [
    UFOExperienceState.SUCCEEDED.id,
    UFOExperienceState.FAILED.id,
    UFOExperienceState.ABORTED.id,
  ],
  [UFOExperienceState.FAILED.id]: [UFOExperienceState.STARTED.id],
  [UFOExperienceState.ABORTED.id]: [UFOExperienceState.STARTED.id],
};

export const canTransition = (
  state1: UFOExperienceStateType,
  state2: UFOExperienceStateType,
) => {
  return (
    UFOStateAvailableTransitions[state1.id] &&
    UFOStateAvailableTransitions[state1.id].includes(state2.id)
  );
};
