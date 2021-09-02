export type UFOExperienceStateType = {
  id: string;
  final?: boolean;
  success?: boolean;
};

export const UFOExperienceState: { [key: string]: UFOExperienceStateType } = {
  NOT_STARTED: { id: 'NOT_STARTED', final: true },
  STARTED: { id: 'STARTED' },
  IN_PROGRESS: { id: 'IN_PROGRESS' },
  BLOCKED: { id: 'BLOCKED' },
  RECOVERED: { id: 'RECOVERED' }, // isn't recovered IN_PROGRESS?
  SUCCEEDED: { id: 'SUCCEEDED', final: true, success: true },
  SUCCEEDED_WAITING_FOR_DEPS: { id: 'SUCCEEDED_WAITING_FOR_DEPS' },
  FAILED: { id: 'FAILED', final: true },
  ABORTED: { id: 'ABORTED', final: true },
};
