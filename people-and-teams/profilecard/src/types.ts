import React from 'react';
import { IntlShape } from 'react-intl';
import UserProfileCardClient from './api/UserProfileCardClient';
import TeamProfileCardClient from './api/TeamProfileCardClient';

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
  /** The id of the team. */
  teamId: string;
  /**
    The id of the organization that the team belongs to.
    Currently this is unused, but will become necessary in the future.
   */
  orgId: string;
  /**
    The id of the user viewing the profile card.

    This is used to determine whether to say that the member count is
    "including you" or not.
   */
  viewingUserId?: string;
  /** An instance of ProfileClient. */
  resourceClient: ProfileClient;
  /**
    A list of extra buttons to be displayed at the bottom of the card.
    View Profile is always included by default.
   */
  actions: ProfileCardAction[];
  /** Analytics are yet to be implemented. */
  analytics?: any;
  /**
    The position relative to the trigger that the card should be displayed in.
   */
  position?: ProfilecardTriggerPosition;
  /**
    The interaction method used to trigger the team profile card to appear.

    - Click is generally recommended, but your needs may vary.

    - Hover works for mouse users, but does not support those who use a
      keyboard or screen reader, avoid using this if it's possible or makes
      sense.

    - Hover-click is usable for scenarios like inline-edits, where mouse users
      cannot click on the trigger without causing side effects, but keyboard
      users are still able to navigate into and trigger the profile card.

    Look at the "Team Profilecard Trigger" or "Trigger Link Types" examples to
    see how they behave, or ask in #team-twp-people-teams on Slack for our
    recommendations.
   */
  trigger?: 'hover' | 'click' | 'hover-click';
  /**
    We generally prefer to wrap the trigger in a link to the team profile
    page. This prop determines how that link behaves.

    - Link is generally the recommended prop (especially in combination with
      click or hover-click for the trigger prop above). It wraps the trigger in
      an anchor tag with the team profile link (that users can interact with
      via middle-click, etc.), but left clicking on the link is suppressed.

    - None does not wrap the trigger in a link at all. This makes it difficult
      for keyboard or screen reader users to know how to trigger the profile
      card. Generally avoid this.

    - Clickable-link wraps the trigger in a link with no special behaviour.
      This is suitable for places where you want the trigger to serve primarily
      as a link, and optionally allow hovering to preview the team first.

    Look at the example on "Trigger Link Types" for more in-depth analysis, or
    ask in #team-twp-people-teams on Slack for our recommendations.
   */
  triggerLinkType?: 'none' | 'link' | 'clickable-link';
  /**
    This is the component that will cause a team profile card to appear when
    interacted with according to the method specified by the trigger prop.
   */
  children?: React.ReactNode;
  /**
    This should be a link to the team's profile page. This will be used for:

    - Wrapping the trigger in a link to the team profile page (unless
      triggerLinkType is `none`).

    - Providing the link for the View Profile action button on the card.
   */
  viewProfileLink: string;
  /**
    An onClick action that navigates to the team's profile page. Something you
    may want, e.g. for an SPA site or tracking analytics of navigation. This
    is optional, just the viewProfileLink will suffice. Will be used for:

    - Adding an onClick to the trigger if the triggerLinkType is
      `clickable-link`.

    - Providing an onClick for the View Profile action button on the card.
   */
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
