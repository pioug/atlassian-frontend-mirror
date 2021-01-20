import React from 'react';
import { IntlShape } from 'react-intl';
import UserProfileCardClient from './api/UserProfileCardClient';
import TeamProfileCardClient from './api/TeamProfileCardClient';

export type { WithOuterListenersProps } from './components/withOuterListeners';

export interface ApiClientResponse {
  User: {
    id: string;
    isBot: boolean;
    isCurrentUser: boolean;
    isNotMentionable: boolean;
    avatarUrl: string | null;
    email: string | null;
    fullName: string | null;
    location: string | null;
    meta: string | null;
    nickname: string | null;
    companyName: string | null;
    remoteTimeString: string | null;
    remoteWeekdayIndex: string | null;
    remoteWeekdayString: string | null;
    status: StatusType;
    statusModifiedDate: number | null;
  };
}

export interface Team {
  // Header image props
  largeAvatarImageUrl?: string;
  smallAvatarImageUrl?: string;
  largeHeaderImageUrl?: string;
  smallHeaderImageUrl?: string;
  // Regular team details
  id: string;
  displayName: string;
  description: string;
  organizationId?: string;
  members?: {
    id: string;
    fullName: string;
    avatarUrl: string;
  }[];
}

export interface ProfileCardClientData {
  isBot: boolean;
  isCurrentUser: boolean;
  isNotMentionable: boolean;
  avatarUrl?: string;
  email?: string;
  fullName?: string;
  location?: string;
  meta?: string;
  nickname?: string;
  companyName?: string;
  timestring?: string;
  status: StatusType;
  statusModifiedDate?: number | null;
}

export interface ProfileCardResourcedProps {
  userId: string;
  cloudId: string;
  resourceClient: ProfileClient;
  actions?: ProfileCardAction[];
  analytics?: any;
  position?: ProfilecardTriggerPosition;
  trigger?: TriggerType;
  children?: React.ReactNode;
}

export interface ProfileCardResourcedState {
  visible?: boolean;
  isLoading?: boolean;
  hasError: boolean;
  error?: ProfileCardErrorType;
  data: ProfileCardClientData | null;
}

export interface ProfileCardTriggerProps {
  userId: string;
  cloudId: string;
  resourceClient: ProfileClient;
  actions?: ProfileCardAction[];
  analytics?: any;
  position?: ProfilecardTriggerPosition;
  trigger?: TriggerType;
  children?: React.ReactNode;
}

export interface ProfileCardTriggerState {
  visible?: boolean;
  isLoading?: boolean;
  hasError: boolean;
  error?: ProfileCardErrorType;
  data: ProfileCardClientData | null;
}

export interface TeamProfileCardTriggerState {
  visible?: boolean;
  isLoading?: boolean;
  hasError: boolean;
  error?: any;
  data: Team | null;
}

export interface TeamProfileCardTriggerProps {
  teamId: string;
  orgId: string;
  viewingUserId?: string;
  resourceClient: ProfileClient;
  actions: ProfileCardAction[];
  analytics?: any;
  position?: ProfilecardTriggerPosition;
  trigger?: 'hover' | 'click' | 'hover-click';
  children?: React.ReactNode;
  viewProfileLink: string;
  viewProfileOnClick?: () => void;
}

export type StatusType = 'active' | 'inactive' | 'closed';

export type TriggerType = 'hover' | 'click';

export type StatusModifiedDateType =
  | 'noDate'
  | 'thisWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'aFewMonths'
  | 'severalMonths'
  | 'moreThanAYear';

export interface ProfileCardAction {
  callback?: (...args: any[]) => any;
  shouldRender?: (data: any) => boolean;
  id?: string;
  label: React.ReactNode;
  // Link to provide general link behaviour to the button. If both link and callback are provided link behaviour will be suppressed on click.
  link?: string;
}

export interface ProfilecardProps {
  isLoading?: boolean;
  hasError?: boolean;
  errorType?: ProfileCardErrorType;
  status?: StatusType;
  isBot?: boolean;
  isNotMentionable?: boolean;
  avatarUrl?: string;
  fullName?: string;
  meta?: string;
  // Nick name is also known as public name
  nickname?: string;
  email?: string;
  location?: string;
  companyName?: string;
  timestring?: string;
  actions?: ProfileCardAction[];
  clientFetchProfile?: any;
  analytics?: any;
  statusModifiedDate?: number | null;

  // Allow to pass custom message for disabled account which `status` prop is `inactive` or `closed`.
  // `disabledAccountMessage` should not contain react-intl components, ex: `FormattedMessage`,
  // because ProfileCard component is wrapped in its own `IntlProvider` and `FormattedMessage` will loads messages of `@atlaskit/profilecard`,
  // not from the consumer of `@atlaskit/profilecard`.
  disabledAccountMessage?: React.ReactNode;
  // Allow to show a status lozenge for disabled account which `status` prop is `inactive` or `closed`
  hasDisabledAccountLozenge?: boolean;
}

export interface TeamProfilecardProps {
  isLoading?: boolean;
  hasError?: boolean;
  errorType?: ProfileCardErrorType;
  team?: Team;
  viewingUserId?: string;
  clientFetchProfile?: () => void;
  analytics?: any;
  actions?: ProfileCardAction[];
  // A function allowing products to provide an href for the user avatars in the profilecard, e.g. so they can
  // link to user's profile pages.
  generateUserLink?: (userId: string) => string;
  viewProfileLink: string;
  viewProfileOnClick?: () => void;
}

export interface MessageIntlProviderProps {
  children: React.ReactNode;
  intl: IntlShape;
}

export type RelativeDateKeyType =
  | 'ThisWeek'
  | 'ThisMonth'
  | 'LastMonth'
  | 'AFewMonths'
  | 'SeveralMonths'
  | 'MoreThanAYear'
  | null;

export interface ProfileClient {
  flushCache: () => void;
  getProfile: (
    cloudId: string,
    userId: string,
  ) => Promise<ProfileCardClientData>;
  getTeamProfile: (teamId: string, orgId?: string) => Promise<Team>;
}

export type ProfilecardTriggerPosition =
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left-start'
  | 'left'
  | 'left-end'
  | 'top-end'
  | 'top'
  | 'top-start'
  | 'right-end'
  | 'right'
  | 'right-start';

export type ProfileCardErrorType = {
  reason: 'default' | 'NotFound';
} | null;

export interface ProfileClientOptions {
  url: string;
  cacheSize?: number;
  cacheMaxAge?: number;
}

export interface ClientOverrides {
  userClient?: UserProfileCardClient;
  teamClient?: TeamProfileCardClient;
}
