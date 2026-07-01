import React from 'react';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import { mentionMessages } from '@atlaskit/editor-common/messages';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type {
	ExtractInjectionAPI,
	TypeAheadHandler,
	TypeAheadItem,
} from '@atlaskit/editor-common/types';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import Lozenge from '@atlaskit/lozenge';
import type { MentionStats } from '@atlaskit/mention';
import {
	MENTION_ITEM_HEIGHT,
	MENTION_ITEM_HEIGHT_REFRESHED,
	MentionItem,
} from '@atlaskit/mention/item';
import type { MentionDescription, MentionProvider } from '@atlaskit/mention/resource';
import { isResolvingMentionProvider } from '@atlaskit/mention/resource';
import type { TeamMember } from '@atlaskit/mention/team-resource';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import { createSingleMentionFragment } from '../../editor-commands';
import type { MentionsPlugin } from '../../mentionsPluginType';
import { mentionPluginKey } from '../../pm-plugins/key';
import { ACTIONS } from '../../pm-plugins/main';
import {
	mentionPlaceholderPluginKey,
	MENTION_PLACEHOLDER_ACTIONS,
} from '../../pm-plugins/mentionPlaceholder';
import { getMentionPluginState } from '../../pm-plugins/utils';
import type { FireElementsChannelEvent, MentionChange, TeamInfoAttrAnalytics } from '../../types';
import InviteItem, { INVITE_ITEM_DESCRIPTION } from '../InviteItem';
import InviteItemWithEmailDomain from '../InviteItem/InviteItemWithEmailDomain';

import {
	buildTypeAheadCancelPayload,
	buildTypeAheadInsertedPayload,
	buildTypeAheadInviteItemClickedPayload,
	buildTypeAheadInviteItemViewedPayload,
	buildTypeAheadRenderedPayload,
} from './analytics';
import { isInviteItem, isTeamStats, isTeamType, shouldKeepInviteItem } from './utils';

const isAgentUserType = (userType: string | undefined): boolean =>
	userType === 'APP' || userType === 'AGENT';

const isAgentMention = (mention: Pick<MentionDescription, 'appType' | 'userType'>): boolean =>
	isAgentUserType(mention.userType) || mention.appType === 'agent';

const isAgentTypeAheadItem = (item: TypeAheadItem): boolean =>
	item.mention ? isAgentMention(item.mention) : false;

const createInviteItem = ({
	mentionProvider,
	onInviteItemMount,
	query,
	emailDomain,
}: {
	emailDomain?: string;
	mentionProvider: MentionProvider;
	onInviteItemMount: () => void;
	query?: string;
}): TypeAheadItem => ({
	title: INVITE_ITEM_DESCRIPTION.id,
	render: ({ isSelected, onClick, onHover }) =>
		emailDomain &&
		mentionProvider.getShouldEnableInlineInvite?.() &&
		fg('jira_invites_auto_tag_new_user_in_mentions_fg') ? (
			<InviteItemWithEmailDomain
				productName={mentionProvider ? mentionProvider.productName : undefined}
				selected={isSelected}
				onMount={onInviteItemMount}
				onMouseEnter={onHover}
				onSelection={onClick}
				userRole={mentionProvider.userRole}
				query={query}
				emailDomain={emailDomain}
			/>
		) : (
			<InviteItem
				productName={mentionProvider ? mentionProvider.productName : undefined}
				selected={isSelected}
				onMount={onInviteItemMount}
				onMouseEnter={onHover}
				onSelection={onClick}
				userRole={mentionProvider.userRole}
			/>
		),
	mention: INVITE_ITEM_DESCRIPTION,
});

const withInviteItem =
	({
		mentionProvider,
		firstQueryWithoutResults,
		currentQuery,
		onInviteItemMount,
		emailDomain,
	}: {
		currentQuery: string;
		emailDomain?: string;
		firstQueryWithoutResults: string;
		mentionProvider: MentionProvider;
		onInviteItemMount: () => void;
	}) =>
	(mentionItems: Array<TypeAheadItem>) => {
		const inviteItem = createInviteItem({
			mentionProvider,
			onInviteItemMount,
			query: currentQuery,
			emailDomain,
		});
		const keepInviteItem = shouldKeepInviteItem(currentQuery, firstQueryWithoutResults);
		if (mentionItems.length === 0) {
			return keepInviteItem ? [inviteItem] : [];
		}

		return [
			...mentionItems,
			// invite item should be shown at the bottom
			inviteItem,
		];
	};

export const mentionToTypeaheadItem = (mention: MentionDescription): TypeAheadItem => {
	const itemHeight = expVal('platform_editor_agent_mentions', 'isEnabled', false)
		? MENTION_ITEM_HEIGHT_REFRESHED
		: MENTION_ITEM_HEIGHT;
	return {
		title: mention.id,
		render: ({ isSelected, onClick, onHover }) => (
			<MentionItem
				mention={mention}
				selected={isSelected}
				onMouseEnter={onHover}
				onSelection={onClick}
				height={itemHeight}
			/>
		),
		getCustomComponentHeight: () => {
			return itemHeight;
		},
		mention,
	};
};

export function memoize<ResultFn extends (mention: MentionDescription) => TypeAheadItem>(
	fn: ResultFn,
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
): { call: ResultFn; clear(): void } {
	// Cache results here
	const seen = new Map<string, TypeAheadItem>();

	function memoized(mention: MentionDescription): TypeAheadItem {
		// Check cache for hits
		const hit = seen.get(mention.id);

		if (hit) {
			return hit;
		}

		// Generate new result and cache it
		const result = fn(mention);
		seen.set(mention.id, result);
		return result;
	}

	return {
		call: memoized as ResultFn,
		clear: seen.clear.bind(seen),
	};
}

const memoizedToItem = memoize(mentionToTypeaheadItem);

const buildAndSendElementsTypeAheadAnalytics =
	(fireEvent: FireElementsChannelEvent) =>
	({
		query,
		mentions,
		stats,
	}: {
		mentions: MentionDescription[];
		query: string;
		stats?: MentionStats;
	}) => {
		let duration: number = 0;
		let userOrTeamIds: string[] | null = null;
		let teams: TeamInfoAttrAnalytics[] | null = null;
		let xProductMentionsLength: number = 0;
		if (!isTeamStats(stats)) {
			// is from primary mention endpoint which could be just user mentions or user/team mentions
			duration = stats && stats.duration;
			teams = null;
			userOrTeamIds = mentions.map((mention) => mention.id);
			xProductMentionsLength = mentions.filter((mention) => mention.isXProductUser).length;
		} else {
			// is from dedicated team-only mention endpoint
			duration = stats && stats.teamMentionDuration;
			userOrTeamIds = null;
			teams = mentions
				.map((mention) =>
					isTeamType(mention.userType)
						? {
								teamId: mention.id,
								// Ignored via go/ees005
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								includesYou: mention.context!.includesYou,
								// Ignored via go/ees005
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								memberCount: mention.context!.memberCount,
							}
						: null,
				)
				.filter((m) => !!m) as TeamInfoAttrAnalytics[];
		}

		const payload = buildTypeAheadRenderedPayload(
			duration,
			userOrTeamIds,
			query,
			teams,
			xProductMentionsLength,
		);
		fireEvent(payload, 'fabric-elements');
	};

/**
 * When a team mention is selected, we render a team link and list of member/user mentions
 * in editor content
 */
const buildNodesForTeamMention = (
	schema: Schema,
	selectedMention: MentionDescription,
	mentionProvider: MentionProvider,
	sanitizePrivateContent?: boolean,
): Fragment => {
	const { nodes, marks } = schema;
	const { name, id: teamId, accessLevel, context } = selectedMention;

	// build team link
	const defaultTeamLink = `${window.location.origin}/people/team/${teamId}`;
	const teamLink = context && context.teamLink ? context.teamLink : defaultTeamLink;
	const teamLinkNode = fg('team-mention-inline-smartlink')
		? schema.nodes.inlineCard.create({ url: teamLink })
		: // Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			schema.text(name!, [marks.link.create({ href: teamLink })]);

	const openBracketText = schema.text('(');
	const closeBracketText = schema.text(')');
	const emptySpaceText = schema.text(' ');

	const inlineNodes: PMNode[] = [teamLinkNode, emptySpaceText, openBracketText];

	const members: TeamMember[] = context && context.members ? context.members : [];
	members.forEach((member: TeamMember, index) => {
		const { name, id } = member;
		const mentionName = `@${name}`;
		const text = sanitizePrivateContent ? '' : mentionName;
		if (sanitizePrivateContent && isResolvingMentionProvider(mentionProvider)) {
			mentionProvider.cacheMentionName(id, name);
		}
		const userMentionNode = nodes.mention.createChecked({
			text,
			id: member.id,
			accessLevel,
			userType: 'DEFAULT',
			// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
			localId: uuid(),
		});

		inlineNodes.push(userMentionNode);
		// should not add empty space after the last user mention.
		if (index !== members.length - 1) {
			inlineNodes.push(emptySpaceText);
		}
	});

	inlineNodes.push(closeBracketText);
	return Fragment.fromArray(inlineNodes);
};

type Props = {
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	fireEvent: FireElementsChannelEvent;
	handleMentionsChanged?: (mentionChanges: MentionChange[]) => void;
	HighlightComponent?: React.ComponentType<React.PropsWithChildren<unknown>>;
	mentionInsertDisplayName?: boolean;
	sanitizePrivateContent?: boolean;
};
/**
 * Shared mentions → typeahead-items transformer used by both the
 * single-shot `getItems` Promise path and the multi-emit
 * `subscribeToItemsUpdates` path. Factoring this out avoids any
 * chance the two paths drift in subtle item-shape behaviour (invite
 * item injection, analytics emission, no-results bookkeeping).
 *
 * NOTE: `firstQueryWithoutResults` is captured by closure in
 * `createTypeAheadConfig` and intentionally mutated here as a
 * side-effect — preserves the existing single-shot semantics.
 */
const makeTransformMentionsToTypeAheadItems = ({
	fireEvent,
	getFirstQueryWithoutResults,
	setFirstQueryWithoutResults,
}: {
	fireEvent: FireElementsChannelEvent;
	getFirstQueryWithoutResults: () => string | null;
	setFirstQueryWithoutResults: (query: string) => void;
}) => {
	return ({
		mentions,
		query,
		stats,
		mentionProvider,
		contextIdentifierProvider,
		sessionId,
	}: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		contextIdentifierProvider: any;
		mentionProvider: MentionProvider;
		mentions: MentionDescription[];
		query: string;
		sessionId: string;
		stats?: MentionStats;
	}): Array<TypeAheadItem> => {
		const mentionItems = mentions.map((mention) => memoizedToItem.call(mention));

		buildAndSendElementsTypeAheadAnalytics(fireEvent)({
			query,
			mentions,
			stats,
		});

		if (mentions.length === 0 && getFirstQueryWithoutResults() === null) {
			setFirstQueryWithoutResults(query);
		}

		if (!mentionProvider.shouldEnableInvite || mentionItems.length > 2) {
			return mentionItems;
		}

		const emailDomain = mentionProvider.userEmailDomain;
		return withInviteItem({
			mentionProvider,
			firstQueryWithoutResults: getFirstQueryWithoutResults() || '',
			currentQuery: query,
			onInviteItemMount: () => {
				fireEvent(
					buildTypeAheadInviteItemViewedPayload(
						sessionId,
						contextIdentifierProvider,
						mentionProvider.userRole,
						fg('jira_invites_auto_tag_new_user_in_mentions_fg')
							? {
									isInlineInviteMentionsEnabled: mentionProvider.getShouldEnableInlineInvite?.(),
								}
							: {},
					),
				);
			},
			emailDomain,
		})(mentionItems);
	};
};

export const createTypeAheadConfig = ({
	sanitizePrivateContent,
	mentionInsertDisplayName,
	fireEvent,
	HighlightComponent,
	api,
	handleMentionsChanged,
}: Props): TypeAheadHandler => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	let sessionId = uuid();
	let firstQueryWithoutResults: string | null = null;
	const subscriptionKeys = new Set<string>();

	const transformMentionsToTypeAheadItems = makeTransformMentionsToTypeAheadItems({
		fireEvent,
		getFirstQueryWithoutResults: () => firstQueryWithoutResults,
		setFirstQueryWithoutResults: (query: string) => {
			firstQueryWithoutResults = query;
		},
	});

	const typeAhead: TypeAheadHandler = {
		id: TypeAheadAvailableNodes.MENTION,
		trigger: '@',
		// Custom regex must have a capture group around trigger
		// so it's possible to use it without needing to scan through all triggers again
		customRegex: '\\(?(@)',
		getHighlight: (_state: EditorState) => {
			const CustomHighlightComponent = HighlightComponent;
			if (CustomHighlightComponent) {
				return <CustomHighlightComponent />;
			}

			return null;
		},
		getItems({ query, editorState }) {
			const pluginState = getMentionPluginState(editorState);

			if (!pluginState?.mentionProvider) {
				return Promise.resolve([]);
			}
			const { mentionProvider } = pluginState;
			const { contextIdentifierProvider } =
				api?.contextIdentifier?.sharedState.currentState() ?? {};

			return new Promise((resolve, reject) => {
				// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
				const key = `loadingMentionsForTypeAhead_${uuid()}`;
				const mentionsSubscribeCallback = (
					mentions: MentionDescription[],
					resultQuery: string = '',
					stats?: MentionStats,
				) => {
					if (query !== resultQuery) {
						return;
					}

					mentionProvider.unsubscribe(key);
					subscriptionKeys.delete(key);
					const items = transformMentionsToTypeAheadItems({
						mentions,
						query,
						stats,
						mentionProvider,
						contextIdentifierProvider,
						sessionId,
					});
					resolve(items);
				};

				subscriptionKeys.add(key);

				mentionProvider.subscribe(key, mentionsSubscribeCallback, () => {
					if (editorExperiment('platform_editor_offline_editing_web', true)) {
						mentionProvider.unsubscribe(key);
						subscriptionKeys.delete(key);
						reject('FETCH_ERROR');
					}
				});

				mentionProvider.filter(query || '', {
					...contextIdentifierProvider,
					sessionId,
				});
			});
		},
		getSections({ intl }) {
			return [
				{
					id: 'people',
					title: intl.formatMessage(mentionMessages.typeAheadSectionPeople),
					filter: (item) => !isAgentTypeAheadItem(item),
					limit: expVal('platform_editor_agent_mentions', 'isEnabled', false) ? 5 : 6,
					...(expVal('platform_editor_agent_mentions', 'isEnabled', false)
						? { sectionTitleDisplay: { showWhenQueryPresent: false, showWhenOnlySection: true } }
						: {}),
				},
				{
					id: 'agents',
					title: intl.formatMessage(mentionMessages.typeAheadSectionAgents),
					filter: (item) => isAgentTypeAheadItem(item),
					limit: expVal('platform_editor_agent_mentions', 'isEnabled', false) ? 5 : undefined,
					...(expVal('platform_editor_agent_mentions', 'isEnabled', false)
						? { sectionTitleDisplay: { showWhenQueryPresent: false, showWhenOnlySection: true } }
						: {}),
					...(expVal('platform_editor_agent_mentions', 'isEnabled', false)
						? {
								lozenge: (
									<Lozenge appearance="new">
										{intl.formatMessage(mentionMessages.typeAheadSectionAgentsLabsLozengeLabel)}
									</Lozenge>
								),
							}
						: {}),
				},
			];
		},
		onOpen: () => {
			firstQueryWithoutResults = null;
		},
		selectItem(state, item, insert, { mode, stats, query, sourceListItem }) {
			const { schema } = state;

			const pluginState = getMentionPluginState(state);
			const { mentionProvider } = pluginState;
			const { id, name, nickname, accessLevel, userType, isXProductUser } = item.mention;
			const { contextIdentifierProvider } =
				api?.contextIdentifier?.sharedState.currentState() ?? {};

			const mentionContext = {
				...contextIdentifierProvider,
				sessionId,
			};
			const isAgentMentionsExperimentEnabled = expVal(
				'platform_editor_agent_mentions',
				'isEnabled',
				false,
			);
			const isAgentMentionInsertion =
				isAgentMentionsExperimentEnabled && isAgentMention(item.mention);
			// userType can be missing for provider-only agent mentions. Copy/paste cannot
			// see appType, so persist APP only when there is no explicit userType.
			const persistedUserType = isAgentMentionInsertion && userType == null ? 'APP' : userType;

			if (mentionProvider && !isInviteItem(item.mention)) {
				mentionProvider.recordMentionSelection(item.mention, mentionContext);
			}

			// use same timer as StatsModifier
			const pickerElapsedTime = stats.startedAt ? performance.now() - stats.startedAt : 0;

			if (mentionProvider && mentionProvider.shouldEnableInvite && isInviteItem(item.mention)) {
				// Don't fire event and the callback with selection by space press
				if (mode !== 'space') {
					fireEvent(
						buildTypeAheadInviteItemClickedPayload(
							pickerElapsedTime,
							stats.keyCount.arrowUp,
							stats.keyCount.arrowDown,
							sessionId,
							mode,
							query,
							contextIdentifierProvider,
							mentionProvider.userRole,
							fg('jira_invites_auto_tag_new_user_in_mentions_fg')
								? { isInlineInviteMentionsEnabled: mentionProvider.getShouldEnableInlineInvite?.() }
								: {},
						),
					);

					if (
						mentionProvider.getShouldEnableInlineInvite?.() &&
						fg('jira_invites_auto_tag_new_user_in_mentions_fg')
					) {
						// Get the email from query, using the same logic as InviteItemWithEmailDomain
						const emailDomain = mentionProvider.userEmailDomain;
						let email = query || '';
						// If query doesn't include @ and we have an email domain, append it
						if (email && !email.includes('@') && emailDomain) {
							email = `${email.toLowerCase()}@${emailDomain}`;
						}
						// If query already includes @, use it as is
						if (email && mentionProvider.showInlineInviteRecaptcha) {
							mentionProvider.showInlineInviteRecaptcha(email);
							const { tr } = state;
							tr.setMeta(mentionPlaceholderPluginKey, {
								action: MENTION_PLACEHOLDER_ACTIONS.SHOW_PLACEHOLDER,
								placeholder: `@${query}`,
							});
							return tr;
						}
					} else if (mentionProvider.onInviteItemClick) {
						// Fallback to old behavior for backward compatibility
						mentionProvider.onInviteItemClick('mention');
					}
				}
				return state.tr;
			}

			let taskListId: string | undefined, taskItemId: string | undefined;
			const taskList = findParentNodeOfType(state.schema.nodes.taskList)(state.selection);
			if (taskList) {
				taskListId = taskList.node.attrs.localId;
				const taskItem = findParentNodeOfType(state.schema.nodes.taskItem)(state.selection);
				if (taskItem) {
					taskItemId = taskItem.node.attrs.localId;
				}
			}

			// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
			const mentionLocalId = uuid();
			if (handleMentionsChanged) {
				const mentionChange = {
					id,
					localId: mentionLocalId,
					method: 'typed' as const,
					type: 'added' as const,
					...(isAgentMentionInsertion ? { shouldSuppressMentionNotification: true } : {}),
				};

				if (taskItemId) {
					handleMentionsChanged([{ ...mentionChange, taskLocalId: taskItemId }]);
				} else {
					handleMentionsChanged([mentionChange]);
				}
			}

			fireEvent(
				buildTypeAheadInsertedPayload(
					pickerElapsedTime,
					stats.keyCount.arrowUp,
					stats.keyCount.arrowDown,
					sessionId,
					mode,
					item.mention,
					mentionLocalId,
					sourceListItem.map((x) => x.mention),
					query,
					contextIdentifierProvider,
					taskListId,
					taskItemId,
					isAgentMentionInsertion,
				),
			);

			// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
			sessionId = uuid();

			if (mentionProvider && isTeamType(userType)) {
				return insert(
					buildNodesForTeamMention(schema, item.mention, mentionProvider, sanitizePrivateContent),
				);
			}

			if (
				!isAgentMentionInsertion &&
				isXProductUser &&
				mentionProvider &&
				mentionProvider.inviteXProductUser
			) {
				mentionProvider.inviteXProductUser(id, name);
			}

			const tr = insert(
				createSingleMentionFragment({
					mentionProvider,
					mentionInsertDisplayName,
					tr: state.tr,
					sanitizePrivateContent,
					suppressInviteXProductUser: isAgentMentionInsertion,
				})({
					name,
					id,
					userType: persistedUserType,
					nickname,
					localId: mentionLocalId,
					accessLevel,
					isXProductUser,
				}),
			);

			if (isAgentMentionInsertion) {
				tr.setMeta(mentionPluginKey, {
					action: ACTIONS.SET_PENDING_TYPED_AGENT_MENTION,
					params: { localId: mentionLocalId, name },
				});
			}

			return tr;
		},
		dismiss({ editorState, query, stats, wasItemInserted }) {
			firstQueryWithoutResults = null;
			const pickerElapsedTime = stats.startedAt ? performance.now() - stats.startedAt : 0;

			if (!wasItemInserted) {
				fireEvent(
					buildTypeAheadCancelPayload(
						pickerElapsedTime,
						stats.keyCount.arrowUp,
						stats.keyCount.arrowDown,
						sessionId,
						query || '',
					),
					'fabric-elements',
				);
			}

			const pluginState = getMentionPluginState(editorState);

			if (pluginState?.mentionProvider) {
				const mentionProvider = pluginState.mentionProvider;

				for (const key of subscriptionKeys) {
					mentionProvider.unsubscribe(key);
				}
			}
			subscriptionKeys.clear();

			// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
			sessionId = uuid();
		},
	};

	/**
	 * Opt-in multi-emit path. Subscribes to the provider's stream of
	 * results for the lifetime of the type-ahead session — does NOT
	 * unsubscribe after the first emission. Lets providers like
	 * `RovoChatMentionResource` deliver people-first then merged
	 * people + agents to the dropdown without the typeahead dropping
	 * the second emission on the floor.
	 *
	 * Gated behind `rovo_chat_agent_selection` (the same gate that drives
	 * agent mentions in the Rovo chat input). The generic type-ahead hook
	 * opts a handler into streaming purely by the presence of this method,
	 * so we only attach it when the gate is on — otherwise the proven
	 * single-shot `getItems` path continues to drive every consumer.
	 */
	const subscribeToItemsUpdates: NonNullable<TypeAheadHandler['subscribeToItemsUpdates']> = ({
		query,
		editorState,
	}) => {
		const pluginState = getMentionPluginState(editorState);
		if (!pluginState?.mentionProvider) {
			return { initial: Promise.resolve([]), subscribe: () => () => {} };
		}
		const { mentionProvider } = pluginState;
		const { contextIdentifierProvider } = api?.contextIdentifier?.sharedState.currentState() ?? {};

		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		const key = `loadingMentionsForTypeAhead_${uuid()}`;
		let initialResolve: ((items: Array<TypeAheadItem>) => void) | null = null;
		let initialReject: ((reason?: unknown) => void) | null = null;
		let initialResolved = false;
		let updateCallback: ((items: Array<TypeAheadItem>) => void) | null = null;
		let unsubscribed = false;

		const initial = new Promise<Array<TypeAheadItem>>((resolve, reject) => {
			initialResolve = resolve;
			initialReject = reject;
		});

		const mentionsSubscribeCallback = (
			mentions: MentionDescription[],
			resultQuery: string = '',
			stats?: MentionStats,
		) => {
			// Drop emissions tagged with a query that has moved on.
			// Mirrors the same guard in the single-shot `getItems`.
			if (query !== resultQuery) {
				return;
			}
			if (unsubscribed) {
				return;
			}
			const items = transformMentionsToTypeAheadItems({
				mentions,
				query,
				stats,
				mentionProvider,
				contextIdentifierProvider,
				sessionId,
			});
			if (!initialResolved) {
				initialResolved = true;
				initialResolve?.(items);
			} else {
				updateCallback?.(items);
			}
		};

		subscriptionKeys.add(key);
		mentionProvider.subscribe(key, mentionsSubscribeCallback, () => {
			if (editorExperiment('platform_editor_offline_editing_web', true)) {
				mentionProvider.unsubscribe(key);
				subscriptionKeys.delete(key);
				if (!initialResolved) {
					initialResolved = true;
					initialReject?.('FETCH_ERROR');
				}
			}
		});

		mentionProvider.filter(query || '', {
			...contextIdentifierProvider,
			sessionId,
		});

		return {
			initial,
			subscribe: (update) => {
				if (updateCallback) {
					throw new Error('TypeAhead mention updates support only one subscriber');
				}
				updateCallback = update;
				return () => {
					unsubscribed = true;
					updateCallback = null;
					mentionProvider.unsubscribe(key);
					subscriptionKeys.delete(key);
					// If cleanup runs before the first emission, settle the initial
					// promise so its `.then` chain (and the closures it holds) is
					// released instead of pending forever.
					if (!initialResolved) {
						initialResolved = true;
						initialResolve?.([]);
					}
				};
			},
		};
	};

	// Presence of `subscribeToItemsUpdates` is how the type-ahead hook
	// opts a handler into the multi-emit path, so only expose it when the
	// agent-selection gate is on.
	if (fg('rovo_chat_agent_selection')) {
		typeAhead.subscribeToItemsUpdates = subscribeToItemsUpdates;
	}

	return typeAhead;
};
