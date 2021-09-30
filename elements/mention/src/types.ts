import { SyntheticEvent } from 'react';
import { ServiceConfig } from '@atlaskit/util-service-support/types';

export interface MentionNameResolver {
  lookupName(id: string): Promise<MentionNameDetails> | MentionNameDetails;
  cacheName(id: string, name: string): void;
}

export type MentionStats = { [key: string]: any };

export interface ResultCallback<T> {
  (result: T, query?: string, stats?: MentionStats): void;
}

export interface ErrorCallback {
  (error: Error, query?: string): void;
}

export interface InfoCallback {
  (info: string): void;
}

export interface AnalyticsCallback {
  (
    event: string,
    actionSubject: string,
    action: string,
    attributes?: {
      [key: string]: any;
    },
  ): void;
}

export interface MentionResourceConfig extends ServiceConfig {
  containerId?: string;
  productId?: string;
  shouldHighlightMention?: (mention: MentionDescription) => boolean;
  inviteExperimentCohort?: InviteExperimentCohort;
  mentionNameResolver?: MentionNameResolver;
  shouldEnableInvite?: boolean;
  onInviteItemClick?: (flow: InviteFlow) => void;
  userRole?: UserRole;
  productName?: string;
  debounceTime?: number;
}

export interface ResourceProvider<Result> {
  /**
   * Subscribe to ResourceProvider results
   *
   * @param {string} key subscriber key used to unsubscribe
   * @param {ResultCallback<Result>} callback This callback only receives latest results
   * @param {ErrorCallback} errCallback This callback will errors
   * @param {InfoCallback} infoCallback This callback will info
   * @param {ResultCallback<Result>} allResultsCallback This callback will receive all results
   */
  subscribe(
    key: string,
    callback?: ResultCallback<Result>,
    errCallback?: ErrorCallback,
    infoCallback?: InfoCallback,
    allResultsCallback?: ResultCallback<Result>,
    analyticsCallback?: AnalyticsCallback,
  ): void;

  /**
   * Unsubscribe to this resource provider results
   * @param {string} key key used when subscribing
   */
  unsubscribe(key: string): void;
}

export type MentionContextIdentifier = {
  containerId?: string;
  objectId?: string;
  childObjectId?: string;
  sessionId?: string;
};

export interface MentionProvider
  extends ResourceProvider<MentionDescription[]>,
    InviteFromMentionProvider {
  filter(query?: string, contextIdentifier?: MentionContextIdentifier): void;
  recordMentionSelection(
    mention: MentionDescription,
    contextIdentifier?: MentionContextIdentifier,
  ): void;
  shouldHighlightMention(mention: MentionDescription): boolean;
  isFiltering(query: string): boolean;
}

export interface HighlightDetail {
  start: number;
  end: number;
}

export interface Highlight {
  name: HighlightDetail[];
  mentionName: HighlightDetail[];
  nickname: HighlightDetail[];
}

export interface Presence {
  time?: string;
  status?: string;
}

export type LozengeColor =
  | 'default'
  | 'success'
  | 'removed'
  | 'inprogress'
  | 'new'
  | 'moved';

export interface LozengeProps {
  text: React.ReactNode;
  appearance?: LozengeColor;
}

export interface MentionDescription {
  id: string;
  avatarUrl?: string;
  name?: string;
  mentionName?: string;
  nickname?: string;
  highlight?: Highlight;
  lozenge?: string | LozengeProps;
  presence?: Presence;
  accessLevel?: string;
  inContext?: boolean;
  userType?: string;
  // Team mention can use context to store members data
  context?: MentionDescContext;
  source?: string; //e.g. 'smarts'
}

export interface MentionDescContext {
  members: TeamMember[];
  includesYou: boolean;
  memberCount: number;
  teamLink: string;
}

export interface MentionsResult {
  mentions: MentionDescription[];
  query: string;
}

export interface TeamMember {
  id: string;
  name: string;
}

// data is returned from team search service
export interface Team {
  id: string;
  smallAvatarImageUrl: string;
  displayName: string;
  members: TeamMember[];
  includesYou: boolean;
  memberCount: number;
  highlight?: Highlight;
}

export type MentionEventHandler = (
  mentionId: string,
  text: string,
  event?: SyntheticEvent<HTMLSpanElement>,
) => void;

export interface OnMentionEvent {
  (mention: MentionDescription, event?: SyntheticEvent<any>): void;
}

export enum MentionType {
  SELF,
  RESTRICTED,
  DEFAULT,
}

export enum UserAccessLevel {
  NONE,
  SITE,
  APPLICATION,
  CONTAINER,
}

export enum UserType {
  DEFAULT,
  SPECIAL,
  APP,
  TEAM,
  SYSTEM,
}

export enum MentionNameStatus {
  UNKNOWN,
  SERVICE_ERROR,
  OK,
}

export interface MentionNameDetails {
  id: string;
  name?: string;
  status: MentionNameStatus;
}

export function isRestricted(accessLevel?: string): boolean {
  return !!accessLevel && accessLevel === UserAccessLevel[UserAccessLevel.NONE];
}

export function isSpecialMention(mention: MentionDescription): boolean {
  return !!mention.userType && mention.userType === UserType[UserType.SPECIAL];
}

export function isAppMention(mention: MentionDescription) {
  return mention.userType && mention.userType === UserType[UserType.APP];
}

export function isTeamMention(mention: MentionDescription) {
  return mention.userType && mention.userType === UserType[UserType.TEAM];
}

export function isSpecialMentionText(mentionText: string) {
  return mentionText && (mentionText === '@all' || mentionText === '@here');
}

export const isPromise = <T>(p: any): p is Promise<T> => !!(p && p.then);

export type InviteFlow = 'mention' | 'assign';

export type UserRole = 'admin' | 'trusted' | 'basic';

export type InviteExperimentCohort = 'variation' | 'control' | 'not-enrolled';

export interface InviteFromMentionProvider {
  productName?: string;
  shouldEnableInvite?: boolean;
  inviteExperimentCohort?: InviteExperimentCohort;
  onInviteItemClick?(flow: InviteFlow): void;
  userRole?: UserRole;
}
