// Avoid exporting new components in this file as they will affect the bundle size of all consumers
// importing directly from @atlaskit/profilecard.
import ProfileCardClient from './api/ProfileCardClient';
import TeamProfileClient from './api/TeamProfileCardClient';
import UserProfileClient, { modifyResponse } from './api/UserProfileCardClient';
import { DELAY_MS_HIDE, DELAY_MS_SHOW } from './components/config';
import ProfileCard from './components/ProfileCard';
import ProfileCardResourced from './components/ProfileCardResourced';
import ProfileCardTrigger from './components/ProfileCardTrigger';
// Do not export TeamProfileCard here as it will break lazy-loading for the team trigger.
import TeamProfileCardTrigger from './components/TeamProfileCardTrigger';

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
