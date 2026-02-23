import { type SyntheticEvent } from 'react';
import { type ServiceConfig } from '@atlaskit/util-service-support/types';

export interface MentionNameResolver {
	cacheName(id: string, name: string): void;
	lookupName(id: string): Promise<MentionNameDetails> | MentionNameDetails;
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

/**
 * Configuration for the MentionResource, which provides a JavaScript API
 * for fetching and searching user mentions from a remote service.
 *
 * Extends {@link ServiceConfig} which provides the base `url`, `securityProvider`,
 * and `refreshedSecurityProvider` fields.
 */
export interface MentionResourceConfig extends ServiceConfig {
	/**
	 * The ID of the container (e.g. a Confluence space or Jira project) used to scope
	 * mention search results. Can be overridden by `MentionContextIdentifier.containerId`.
	 */
	containerId?: string;

	/**
	 * Debounce time in milliseconds for the `filter` method. When set, rapid successive
	 * calls to `filter` will be debounced to reduce the number of network requests.
	 */
	debounceTime?: number;

	/**
	 * Custom HTTP headers to include in mention service requests.
	 * Only applied when the `mentions_custom_headers` feature flag is enabled.
	 */
	headers?: Record<string, string>;

	/**
	 * Callback to invite a cross-product user. Invoked when a user from another
	 * Atlassian product is selected for mention and needs to be invited.
	 *
	 * @param userId - The ID of the user to invite.
	 * @param mentionName - The display name of the user being invited.
	 * @returns A promise that resolves when the invitation is complete.
	 */
	inviteXProductUser?: (userId: string, mentionName: string) => Promise<void>;

	/**
	 * A resolver for looking up and caching mention display names by user ID.
	 * Used by `ResolvingMentionProvider` to resolve names for mentions that
	 * only have an ID (e.g. when rendering stored mention nodes).
	 */
	mentionNameResolver?: MentionNameResolver;

	/**
	 * Callback invoked when the inline invite item is clicked in the mention picker.
	 *
	 * @param flow - The type of invite flow, either `'mention'` or `'assign'`.
	 */
	onInviteItemClick?: (flow: InviteFlow) => void;

	/**
	 * The product identifier (e.g. `'confluence'`, `'jira'`) sent as a query parameter
	 * (`productIdentifier`) to the mention service for product-scoped results.
	 */
	productId?: string;

	/**
	 * The display name of the product, exposed on the `MentionProvider` for use
	 * by invite-related UI components.
	 */
	productName?: string;

	/**
	 * Whether to enable the inline invite functionality in the mention picker,
	 * allowing users to invite people who are not yet part of the site.
	 */
	shouldEnableInvite?: boolean;

	/**
	 * A function to determine whether a given mention should be visually highlighted
	 * (e.g. as a self-mention). When provided, it is called for each mention to decide
	 * if the `MentionType.SELF` styling should be applied.
	 *
	 * @param mention - The mention to evaluate.
	 * @returns `true` if the mention should be highlighted.
	 */
	shouldHighlightMention?: (mention: MentionDescription) => boolean;

	/**
	 * The role of the current user, used to determine invite permissions
	 * in the mention picker. Defaults to `'basic'` if not provided.
	 */
	userRole?: UserRole;
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
	childObjectId?: string;
	containerId?: string;
	objectId?: string;
	sessionId?: string;
};

export interface MentionProvider
	extends
		ResourceProvider<MentionDescription[]>,
		InviteFromMentionProvider,
		XProductInviteMentionProvider {
	filter(query?: string, contextIdentifier?: MentionContextIdentifier): void;
	isFiltering(query: string): boolean;
	recordMentionSelection(
		mention: MentionDescription,
		contextIdentifier?: MentionContextIdentifier,
	): void;
	shouldHighlightMention(mention: MentionDescription): boolean;
}

export interface HighlightDetail {
	end: number;
	start: number;
}

export interface Highlight {
	mentionName: HighlightDetail[];
	name: HighlightDetail[];
	nickname: HighlightDetail[];
}

export interface Presence {
	status?: string;
	time?: string;
}

export type LozengeColor = 'default' | 'success' | 'removed' | 'inprogress' | 'new' | 'moved';

export interface LozengeProps {
	appearance?: LozengeColor;
	text: React.ReactNode;
}

export interface MentionDescription {
	accessLevel?: string;
	appType?: string | null;
	avatarUrl?: string;
	// Team mention can use context to store members data
	context?: MentionDescContext;
	highlight?: Highlight;
	id: string;
	inContext?: boolean;
	isXProductUser?: boolean;
	lozenge?: string | LozengeProps;
	mentionName?: string;
	name?: string;
	nickname?: string;
	presence?: Presence;
	source?: string; //e.g. 'smarts'
	userType?: string;
}

export interface MentionDescContext {
	includesYou: boolean;
	memberCount: number;
	members: TeamMember[];
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
	displayName: string;
	highlight?: Highlight;
	id: string;
	includesYou: boolean;
	memberCount: number;
	members: TeamMember[];
	smallAvatarImageUrl: string;
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

export enum SliNames {
	SEARCH = 'searchUser',
	SEARCH_TEAM = 'searchTeam',
	INITIAL_STATE = 'initialState',
	SELECT = 'select',
	SELECT_TEAM = 'selectTeam',
}

export enum ComponentNames {
	TYPEAHEAD = 'mentionTypeahead',
	MENTION = 'mention',
}

export enum Actions {
	VIEWED = 'viewed',
	CLICKED = 'clicked',
	CLOSED = 'closed',
	SUCCEEDED = 'succeeded',
	FAILED = 'failed',
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

export interface InviteFromMentionProvider {
	// TODO: to be replaced with shouldEnablInlineInvite during experiment cleanup
	getShouldEnableInlineInvite?: () => boolean;
	InlineInviteRecaptcha?: React.ComponentType<any> | null;
	onInviteItemClick?(flow: InviteFlow): void;
	productName?: string;
	shouldEnableInvite?: boolean;
	showInlineInviteRecaptcha?: (email: string) => void;
	userEmailDomain?: string;
	userRole?: UserRole;
}

export interface XProductInviteMentionProvider {
	inviteXProductUser?: (userId: string, mentionName: string) => Promise<void>;
}
