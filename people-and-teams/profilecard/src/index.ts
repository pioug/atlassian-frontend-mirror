// Avoid exporting new components in this file as they will affect the bundle size of all consumers
// importing directly from @atlaskit/profilecard.
import ProfileCardClient from './client/ProfileCardClient';
// Note: when generating and updating Flow types in Jira, `TeamProfileClient` and `TeamProfileCardClient` are the same type
import TeamProfileClient from './client/TeamProfileCardClient';
// Note: when generating and updating Flow types in Jira, `UserProfileClient` and `UserProfileCardClient` are the same type
import UserProfileClient, {
  modifyResponse,
} from './client/UserProfileCardClient';
import TeamProfileCardTrigger from './components/Team/TeamProfileCardTrigger';
import ProfileCard from './components/User/ProfileCard';
import ProfileCardResourced from './components/User/ProfileCardResourced';
import ProfileCardTrigger from './components/User/ProfileCardTrigger';
// Do not export TeamProfileCard here as it will break lazy-loading for the team trigger.
import { DELAY_MS_HIDE, DELAY_MS_SHOW } from './util/config';

// Legacy Profile Card in Jira still needs to use `withOuterListeners`
export { default as withOuterListeners } from './util/withOuterListeners';
export type { WithOuterListenersProps } from './util/withOuterListeners';

export type {
  // Types
  ProfileCardErrorType,
  ProfilecardTriggerPosition,
  RelativeDateKeyType,
  StatusModifiedDateType,
  StatusType,
  TriggerType,
  // Interfaces
  ApiClientResponse,
  MessageIntlProviderProps,
  ProfileCardAction,
  ProfileCardClientData,
  ProfileCardResourcedProps,
  ProfileCardResourcedState,
  ProfileCardTriggerProps,
  ProfileCardTriggerState,
  ProfileClientOptions,
  ProfilecardProps,
  Team,
} from './types';

// We cannot export this component inside `./components/Team/index.ts` because it breaks the lazyload
// so we have to export this here. `TeamProfileCard` helps to build legacy team profile card inside Jira FE.
export { default as TeamProfileCard } from './components/Team/TeamProfileCard';

export { ProfileCard };
export { ProfileCardTrigger };
export { TeamProfileCardTrigger };
export {
  ProfileCardClient as ProfileClient,
  TeamProfileClient,
  UserProfileClient,
  modifyResponse,
};
export { DELAY_MS_SHOW, DELAY_MS_HIDE };

export default ProfileCardResourced;
