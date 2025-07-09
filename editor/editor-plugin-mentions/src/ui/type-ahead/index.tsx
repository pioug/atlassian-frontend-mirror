import React from 'react';

import uuid from 'uuid';

import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type {
	ExtractInjectionAPI,
	TypeAheadHandler,
	TypeAheadItem,
} from '@atlaskit/editor-common/types';
import { getAnnotationMarksForPos } from '@atlaskit/editor-common/utils';
import type { Mark, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { MentionStats } from '@atlaskit/mention';
import { MENTION_ITEM_HEIGHT, MentionItem } from '@atlaskit/mention/item';
import type { MentionDescription, MentionProvider } from '@atlaskit/mention/resource';
import { isResolvingMentionProvider } from '@atlaskit/mention/resource';
import type { TeamMember } from '@atlaskit/mention/team-resource';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { createSingleMentionFragment } from '../../editor-commands';
import type { MentionsPlugin } from '../../mentionsPluginType';
import { getMentionPluginState } from '../../pm-plugins/utils';
import type { FireElementsChannelEvent, TeamInfoAttrAnalytics } from '../../types';
import InviteItem, { INVITE_ITEM_DESCRIPTION } from '../InviteItem';

import {
	buildTypeAheadCancelPayload,
	buildTypeAheadInsertedPayload,
	buildTypeAheadInviteItemClickedPayload,
	buildTypeAheadInviteItemViewedPayload,
	buildTypeAheadRenderedPayload,
} from './analytics';
import { isInviteItem, isTeamStats, isTeamType, shouldKeepInviteItem } from './utils';

const createInviteItem = ({
	mentionProvider,
	onInviteItemMount,
}: {
	mentionProvider: MentionProvider;
	onInviteItemMount: () => void;
}): TypeAheadItem => ({
	title: INVITE_ITEM_DESCRIPTION.id,
	render: ({ isSelected, onClick, onHover }) => (
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
	}: {
		firstQueryWithoutResults: string;
		currentQuery: string;
		mentionProvider: MentionProvider;
		onInviteItemMount: () => void;
	}) =>
	(mentionItems: Array<TypeAheadItem>) => {
		const inviteItem = createInviteItem({ mentionProvider, onInviteItemMount });
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
	return {
		title: mention.id,
		render: ({ isSelected, onClick, onHover }) => (
			<MentionItem
				mention={mention}
				selected={isSelected}
				onMouseEnter={onHover}
				onSelection={onClick}
			/>
		),
		getCustomComponentHeight: () => {
			return MENTION_ITEM_HEIGHT;
		},
		mention,
	};
};

export function memoize<ResultFn extends (mention: MentionDescription) => TypeAheadItem>(
	fn: ResultFn,
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
		query: string;
		mentions: MentionDescription[];
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
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
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
	sanitizePrivateContent?: boolean;
	mentionInsertDisplayName?: boolean;
	HighlightComponent?: React.ComponentType<React.PropsWithChildren<unknown>>;
	fireEvent: FireElementsChannelEvent;
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	handleMentionsChanged?: (
		mentionChanges: {
			type: 'added' | 'deleted';
			localId: string;
			id: string;
			taskLocalId?: string;
			method?: 'pasted' | 'typed';
		}[],
	) => void;
};
export const createTypeAheadConfig = ({
	sanitizePrivateContent,
	mentionInsertDisplayName,
	fireEvent,
	HighlightComponent,
	api,
	handleMentionsChanged,
}: Props) => {
	let sessionId = uuid();
	let firstQueryWithoutResults: string | null = null;
	const subscriptionKeys = new Set<string>();

	const typeAhead: TypeAheadHandler = {
		id: TypeAheadAvailableNodes.MENTION,
		trigger: '@',
		// Custom regex must have a capture group around trigger
		// so it's possible to use it without needing to scan through all triggers again
		customRegex: '\\(?(@)',
		getHighlight: (state: EditorState) => {
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
					const mentionItems = mentions.map((mention) => memoizedToItem.call(mention));

					buildAndSendElementsTypeAheadAnalytics(fireEvent)({
						query,
						mentions,
						stats,
					});

					if (mentions.length === 0 && firstQueryWithoutResults === null) {
						firstQueryWithoutResults = query;
					}

					if (!mentionProvider.shouldEnableInvite || mentionItems.length > 2) {
						resolve(mentionItems);
					} else {
						const items = withInviteItem({
							mentionProvider,
							firstQueryWithoutResults: firstQueryWithoutResults || '',
							currentQuery: query,
							onInviteItemMount: () => {
								fireEvent(
									buildTypeAheadInviteItemViewedPayload(
										sessionId,
										contextIdentifierProvider,
										mentionProvider.userRole,
									),
								);
							},
						})(mentionItems);

						resolve(items);
					}
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
		onOpen: () => {
			firstQueryWithoutResults = null;
		},
		selectItem(state, item, insert, { mode, stats, query, sourceListItem }) {
			const { schema } = state;

			const pluginState = getMentionPluginState(state);
			const { mentionProvider } = pluginState;
			const { id, name, nickname, accessLevel, userType, isXProductUser } = item.mention;
			const trimmedNickname = nickname && nickname.startsWith('@') ? nickname.slice(1) : nickname;
			const renderName = mentionInsertDisplayName || !trimmedNickname ? name : trimmedNickname;
			const { contextIdentifierProvider } =
				api?.contextIdentifier?.sharedState.currentState() ?? {};

			const mentionContext = {
				...contextIdentifierProvider,
				sessionId,
			};

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
						),
					);

					if (mentionProvider.onInviteItemClick) {
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

			const mentionLocalId = uuid();
			if (handleMentionsChanged) {
				if (taskItemId) {
					handleMentionsChanged([
						{
							type: 'added',
							localId: mentionLocalId,
							id,
							taskLocalId: taskItemId,
							method: 'typed',
						},
					]);
				} else {
					handleMentionsChanged([{ type: 'added', localId: mentionLocalId, id, method: 'typed' }]);
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
				),
			);

			sessionId = uuid();

			if (mentionProvider && isTeamType(userType)) {
				return insert(
					buildNodesForTeamMention(schema, item.mention, mentionProvider, sanitizePrivateContent),
				);
			}

			if (isXProductUser && mentionProvider && mentionProvider.inviteXProductUser) {
				mentionProvider.inviteXProductUser(id, name);
			}

			// This replaces logic below
			if (fg('platform_mention_insert_mention_refactor')) {
				return insert(
					createSingleMentionFragment({
						mentionProvider,
						mentionInsertDisplayName,
						tr: state.tr,
						sanitizePrivateContent,
					})({
						name,
						id,
						userType,
						nickname,
						localId: mentionLocalId,
						accessLevel,
						isXProductUser,
					}),
				);
			}

			// Don't insert into document if document data is sanitized.
			const text = sanitizePrivateContent ? '' : `@${renderName}`;

			if (sanitizePrivateContent && isResolvingMentionProvider(mentionProvider)) {
				// Cache (locally) for later rendering
				mentionProvider.cacheMentionName(id, renderName);
			}

			const annotationMarksForPos: Mark[] | undefined = fg(
				// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
				'editor_inline_comments_paste_insert_nodes',
			)
				? getAnnotationMarksForPos(state.tr.selection.$head)
				: undefined;

			const mentionNode = schema.nodes.mention.createChecked(
				{
					text,
					id,
					accessLevel,
					userType: userType === 'DEFAULT' ? null : userType,
					localId: mentionLocalId,
				},
				null,
				// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
				fg('editor_inline_comments_paste_insert_nodes') ? annotationMarksForPos : undefined,
			);
			const space = schema.text(
				' ',
				// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
				fg('editor_inline_comments_paste_insert_nodes') ? annotationMarksForPos : undefined,
			);

			return insert(Fragment.from([mentionNode, space]));
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

			sessionId = uuid();
		},
	};

	return typeAhead;
};
