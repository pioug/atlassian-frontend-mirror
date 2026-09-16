import React from 'react';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuid } from 'uuid';

import { mentionMessages } from '@atlaskit/editor-common/messages';
import type { ProfilecardProvider } from '@atlaskit/editor-common/provider-factory';
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
import Lozenge from '@atlaskit/lozenge/lozenge';
import type {
	MentionStats,
	MentionDescription,
	MentionProvider,
	TeamMember,
} from '@atlaskit/mention/types';
import {
	MENTION_ITEM_HEIGHT,
	MENTION_ITEM_HEIGHT_REFRESHED,
} from '@atlaskit/mention/mention-item/styles';
import MentionItem from '@atlaskit/mention/mention-item';
import { isResolvingMentionProvider } from '@atlaskit/mention/is-resolving-mention-provider';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import { createSingleMentionFragment } from '../../editor-commands';
import type { MentionsPlugin } from '../../mentionsPluginType';
import { mentionPluginKey } from '../../pm-plugins/key';
import { ACTIONS } from '../../pm-plugins/main';
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
import { AgentMentionLoadErrorItem } from './AgentMentionLoadErrorItem';
import { MentionItemWithProfileCard } from './MentionItemWithProfileCard';
import {
	isAgentMention,
	isAgentMentionLoadError,
	isBotOrTeamMention,
	isExplicitAgentMention,
	isInviteItem,
	isTeamStats,
	isTeamType,
	orderMentionsForDisplay,
	shouldKeepInviteItem,
} from './utils';

const isAgentTypeAheadItem = (item: TypeAheadItem): boolean =>
	item.mention ? isAgentMention(item.mention) : false;

const isAgentMentionLoadErrorEnabled = (
	mention:
		| (Partial<Pick<MentionDescription, 'appType' | 'id' | 'isPlaceholder' | 'userType'>> & {
				placeholderType?: string;
		  })
		| undefined,
): boolean =>
	isExperimentEnabled('platform_editor_agent_mentions_rovo_query_timeout') &&
	isAgentMentionLoadError(mention);

const isSearchOrderedAgentTypeAheadItem = (item: TypeAheadItem): boolean =>
	!!item.mention && isExplicitAgentMention(item.mention);

const isSearchOrderedPersonTypeAheadItem = (item: TypeAheadItem): boolean =>
	!!item.mention &&
	!isInviteItem(item.mention) &&
	!isExplicitAgentMention(item.mention) &&
	!isBotOrTeamMention(item.mention);

const shouldApplyMentionSearchOrder = (query: string): boolean =>
	isExperimentEnabled('platform_editor_mention_search_order') && query.trim().length > 0;

// A non-selectable loading placeholder injected by the provider (e.g.
// `RovoChatMentionResource`) while the slower agent source resolves. It
// renders as a skeleton row via `@atlaskit/mention`'s `MentionItem` and
// must never be inserted or counted in rendered-mention analytics.
const isMentionPlaceholder = (
	mention: Pick<MentionDescription, 'isPlaceholder'> | undefined,
): boolean => !!mention?.isPlaceholder;

const isLoadingPlaceholder = (
	mention:
		| (Partial<Pick<MentionDescription, 'appType' | 'id' | 'isPlaceholder' | 'userType'>> & {
				placeholderType?: string;
		  })
		| undefined,
): boolean => isMentionPlaceholder(mention) && !isAgentMentionLoadErrorEnabled(mention);

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
		fg('inline_invite_from_mentions_kill_switch') ? (
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

const makeMentionToTypeaheadItem =
	({
		useRefreshedItemHeight,
		profilecardProvider,
	}: {
		profilecardProvider?: Promise<ProfilecardProvider>;
		useRefreshedItemHeight: boolean;
	}) =>
	(mention: MentionDescription): TypeAheadItem => {
		const itemHeight = useRefreshedItemHeight ? MENTION_ITEM_HEIGHT_REFRESHED : MENTION_ITEM_HEIGHT;

		if (isAgentMentionLoadErrorEnabled(mention)) {
			return {
				title: mention.id,
				render: ({ onClick }) => <AgentMentionLoadErrorItem onRetry={onClick} />,
				getCustomComponentHeight: () => {
					return itemHeight;
				},
				mention,
			};
		}

		if (
			isLoadingPlaceholder(mention) &&
			isExperimentEnabled('platform_editor_mention_search_order')
		) {
			return {
				title: mention.id,
				isNonInteractive: true,
				render: ({ isSelected, onClick }) => (
					<MentionItemWithProfileCard
						mention={mention}
						selected={isSelected}
						onSelection={onClick}
						height={itemHeight}
						profilecardProvider={profilecardProvider}
					/>
				),
				getCustomComponentHeight: () => {
					return itemHeight;
				},
				mention,
			};
		}

		return {
			title: mention.id,
			render: ({ isSelected, onClick, onHover }) =>
				(expVal('platform_editor_agent_mentions', 'isEnabled', false) &&
					fg('platform_editor_mention_typeahead_profilecard')) ||
				fg('platform_editor_agent_card_fixes') ? (
					<MentionItemWithProfileCard
						mention={mention}
						selected={isSelected}
						onSelection={onClick}
						height={itemHeight}
						profilecardProvider={profilecardProvider}
					/>
				) : (
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

export const mentionToTypeaheadItem = (mention: MentionDescription): TypeAheadItem =>
	makeMentionToTypeaheadItem({
		useRefreshedItemHeight: expVal('platform_editor_agent_mentions', 'isEnabled', false),
	})(mention);

/**
 * Caches mention typeahead items by mention ID.
 */
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

const buildAndSendElementsTypeAheadAnalytics =
	(fireEvent: FireElementsChannelEvent) =>
	({
		query,
		mentions,
		stats,
		mentionTypeaheadSessionId,
		agentAnalytics,
	}: {
		agentAnalytics?: {
			agentCount: number;
			agentSectioningEnabled: boolean;
		};
		mentions: MentionDescription[];
		mentionTypeaheadSessionId: string;
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
			mentionTypeaheadSessionId,
			agentAnalytics,
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
	canOpenTypeAhead?: () => boolean;
	enableAgentSectioning?: boolean;
	fireEvent: FireElementsChannelEvent;
	handleMentionsChanged?: (mentionChanges: MentionChange[]) => void;
	HighlightComponent?: React.ComponentType<React.PropsWithChildren<unknown>>;
	mentionInsertDisplayName?: boolean;
	profilecardProvider?: Promise<ProfilecardProvider>;
	sanitizePrivateContent?: boolean;
	showAgentMentionsLabsLozenge?: boolean;
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
	hasFiredInviteItemViewed,
	markInviteItemViewed,
	toItem,
	enableAgentSectioning,
}: {
	enableAgentSectioning: boolean;
	fireEvent: FireElementsChannelEvent;
	getFirstQueryWithoutResults: () => string | null;
	hasFiredInviteItemViewed: () => boolean;
	markInviteItemViewed: () => void;
	setFirstQueryWithoutResults: (query: string) => void;
	toItem: (mention: MentionDescription) => TypeAheadItem;
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
		const displayMentions = shouldApplyMentionSearchOrder(query)
			? orderMentionsForDisplay(mentions)
			: mentions;
		const mentionItems = displayMentions.map((mention) => toItem(mention));
		// Provider placeholders stay in `mentionItems` so loading/error rows render,
		// but they are not real mention results for analytics or agent counts.
		const realMentions = displayMentions.filter((mention) => !isMentionPlaceholder(mention));
		const agentCount = realMentions.filter(isAgentMention).length;
		const agentAnalytics = {
			agentCount,
			agentSectioningEnabled: enableAgentSectioning,
		};

		buildAndSendElementsTypeAheadAnalytics(fireEvent)({
			query,
			mentions: realMentions,
			stats,
			mentionTypeaheadSessionId: sessionId,
			agentAnalytics,
		});

		// While a loading placeholder is present the result set isn't settled yet
		// (e.g. agents still resolving) — don't record this query as "no results",
		// or a later emission that arrives with results would be ignored.
		if (
			realMentions.length === 0 &&
			!mentions.some(isLoadingPlaceholder) &&
			getFirstQueryWithoutResults() === null
		) {
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
				if (fg('inline_invite_from_mentions_kill_switch')) {
					if (hasFiredInviteItemViewed()) {
						return;
					}
					markInviteItemViewed();
				}
				fireEvent(
					buildTypeAheadInviteItemViewedPayload(
						sessionId,
						contextIdentifierProvider,
						mentionProvider.userRole,
						fg('inline_invite_from_mentions_kill_switch')
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
	canOpenTypeAhead,
	sanitizePrivateContent,
	mentionInsertDisplayName,
	fireEvent,
	HighlightComponent,
	api,
	handleMentionsChanged,
	enableAgentSectioning = false,
	showAgentMentionsLabsLozenge = false,
	profilecardProvider,
}: Props): TypeAheadHandler => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	let sessionId = uuid();
	let firstQueryWithoutResults: string | null = null;
	let lastTypeAheadQuery = '';
	let hasFiredInviteItemViewed = false;
	const subscriptionKeys = new Set<string>();

	const transformMentionsToTypeAheadItems = makeTransformMentionsToTypeAheadItems({
		enableAgentSectioning,
		fireEvent,
		getFirstQueryWithoutResults: () => firstQueryWithoutResults,
		setFirstQueryWithoutResults: (query: string) => {
			firstQueryWithoutResults = query;
		},
		hasFiredInviteItemViewed: () => hasFiredInviteItemViewed,
		markInviteItemViewed: () => {
			hasFiredInviteItemViewed = true;
		},
		toItem: memoize(
			makeMentionToTypeaheadItem({
				useRefreshedItemHeight: enableAgentSectioning,
				profilecardProvider,
			}),
		).call,
	});

	const typeAhead: TypeAheadHandler = {
		canOpen: canOpenTypeAhead,
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
			lastTypeAheadQuery = query || '';
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
					mentionProvider.unsubscribe(key);
					subscriptionKeys.delete(key);
					reject('FETCH_ERROR');
				});

				mentionProvider.filter(query || '', {
					...contextIdentifierProvider,
					sessionId,
				});
			});
		},
		getSections({ intl }) {
			if (!enableAgentSectioning) {
				return [];
			}

			const applySearchOrder = shouldApplyMentionSearchOrder(lastTypeAheadQuery);

			return [
				{
					id: 'people',
					title: intl.formatMessage(mentionMessages.typeAheadSectionPeople),
					filter: applySearchOrder
						? isSearchOrderedPersonTypeAheadItem
						: (item) => {
								if (isAgentTypeAheadItem(item)) {
									return false;
								}
								// Keep the invite ("Add teammate") row out of the people section so no
								// section claims it. `buildSectionedResult` then appends it after every
								// section, placing it below the agent results instead of above them, so the
								// first highlighted option is an agent you can pick with Enter.
								if (
									item.mention &&
									isInviteItem(item.mention) &&
									fg('platform_editor_agent_mentions_invite_order')
								) {
									return false;
								}
								return true;
							},
					limit: 5,
					sectionTitleDisplay: { showWhenQueryPresent: false, showWhenOnlySection: true },
				},
				{
					id: 'agents',
					title: intl.formatMessage(mentionMessages.typeAheadSectionAgents),
					filter: applySearchOrder ? isSearchOrderedAgentTypeAheadItem : isAgentTypeAheadItem,
					limit: 5,
					sectionTitleDisplay: { showWhenQueryPresent: false, showWhenOnlySection: true },
					lozenge:
						!fg('platform_editor_agent_mentions_drop_one_fixes') || showAgentMentionsLabsLozenge ? (
							<Lozenge appearance="discovery">
								{intl.formatMessage(mentionMessages.typeAheadSectionAgentsLabsLozengeLabel)}
							</Lozenge>
						) : null,
				},
			];
		},
		onOpen: () => {
			firstQueryWithoutResults = null;
			lastTypeAheadQuery = '';
			hasFiredInviteItemViewed = false;
		},
		selectItem(state, item, insert, { mode, stats, query, sourceListItem }) {
			const { schema } = state;

			// Placeholder isn't selectable. Return `false` (not a transaction) so
			// the runtime keeps the dropdown open; a transaction would close it.
			if (isLoadingPlaceholder(item.mention)) {
				return false;
			}

			const pluginState = getMentionPluginState(state);
			const { mentionProvider } = pluginState;
			const { contextIdentifierProvider } =
				api?.contextIdentifier?.sharedState.currentState() ?? {};

			const mentionContext = {
				...contextIdentifierProvider,
				sessionId,
			};

			if (isAgentMentionLoadErrorEnabled(item.mention)) {
				mentionProvider?.filter(query || '', mentionContext);
				return false;
			}

			const { id, name, nickname, accessLevel, userType, isXProductUser } = item.mention;
			const isAgentMentionSelection = isAgentMention(item.mention);
			const isAgentMentionInsertion =
				isAgentMentionSelection && expVal('platform_editor_agent_mentions', 'isEnabled', false);
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
							fg('inline_invite_from_mentions_kill_switch')
								? { isInlineInviteMentionsEnabled: mentionProvider.getShouldEnableInlineInvite?.() }
								: {},
						),
					);

					if (
						mentionProvider.getShouldEnableInlineInvite?.() &&
						fg('inline_invite_from_mentions_kill_switch')
					) {
						// Get the email from query, using the same logic as InviteItemWithEmailDomain
						const emailDomain = mentionProvider.userEmailDomain;
						let email = query || '';
						// If query doesn't include @ and we have an email domain, append it
						if (email && !email.includes('@') && emailDomain) {
							email = `${email.toLowerCase()}@${emailDomain}`;
						}
						// If query already includes @, use it as is
						if (email && mentionProvider.showInlineInvitePopup) {
							const pendingLocalId = crypto.randomUUID();
							const tr = insert(
								createSingleMentionFragment({
									mentionProvider,
									mentionInsertDisplayName,
									tr: state.tr,
									sanitizePrivateContent,
								})({
									name: email,
									id: pendingLocalId,
									userType: 'DEFAULT',
									localId: pendingLocalId,
									accessLevel: 'CONTAINER',
								}),
							);
							mentionProvider.showInlineInvitePopup(email, pendingLocalId);
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
					isAgentMentionSelection,
					enableAgentSectioning,
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
				// Cache the agent name so pasted mentions (where attrs.text is stripped)
				// can recover it synchronously via resolveMentionName() cache hit.
				if (
					name &&
					mentionProvider &&
					isResolvingMentionProvider(mentionProvider) &&
					fg('platform_editor_agent_mentions_drop_one_fixes')
				) {
					mentionProvider.cacheMentionName(id, name);
				}
			}

			return tr;
		},
		dismiss({ editorState, query, stats, wasItemInserted }) {
			firstQueryWithoutResults = null;
			hasFiredInviteItemViewed = false;
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
	 * Gated behind the `rovo_chat_mention_agents` experiment (the same control
	 * that drives
	 * agent mentions in the Rovo chat input). The generic type-ahead hook
	 * opts a handler into streaming purely by the presence of this method,
	 * so we only attach it when the gate is on — otherwise the proven
	 * single-shot `getItems` path continues to drive every consumer.
	 */
	const subscribeToItemsUpdates: NonNullable<TypeAheadHandler['subscribeToItemsUpdates']> = ({
		query,
		editorState,
	}) => {
		lastTypeAheadQuery = query || '';
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
		let pendingUpdate: Array<TypeAheadItem> | null = null;
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
			} else if (
				enableAgentSectioning &&
				isExperimentEnabled('platform_editor_mention_search_order') &&
				!updateCallback
			) {
				// Agent Studio can resolve before the typeahead installs its update subscriber.
				pendingUpdate = items;
			} else {
				updateCallback?.(items);
			}
		};

		subscriptionKeys.add(key);
		mentionProvider.subscribe(key, mentionsSubscribeCallback, () => {
			mentionProvider.unsubscribe(key);
			subscriptionKeys.delete(key);
			if (!initialResolved) {
				initialResolved = true;
				initialReject?.('FETCH_ERROR');
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
				if (
					enableAgentSectioning &&
					isExperimentEnabled('platform_editor_mention_search_order') &&
					pendingUpdate
				) {
					updateCallback(pendingUpdate);
					pendingUpdate = null;
				}
				return () => {
					unsubscribed = true;
					updateCallback = null;
					pendingUpdate = null;
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

	if (enableAgentSectioning && isExperimentEnabled('platform_editor_mention_search_order')) {
		typeAhead.subscribeToItemsUpdates = subscribeToItemsUpdates;
	}

	// Presence of `subscribeToItemsUpdates` is how the type-ahead hook
	// opts a handler into the multi-emit path, so only expose it when the
	// agent-mentions experiment is enabled.
	if (isExperimentEnabled('rovo_chat_mention_agents')) {
		typeAhead.subscribeToItemsUpdates = subscribeToItemsUpdates;
	}

	return typeAhead;
};
