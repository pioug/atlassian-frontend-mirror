import React from 'react';
import uuid from 'uuid';
import { Schema, Fragment, Node as PMNode } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import {
  isResolvingMentionProvider,
  MentionDescription,
  MentionProvider,
  TeamMentionProvider,
} from '@atlaskit/mention/resource';
import { MENTION_ITEM_HEIGHT, MentionItem } from '@atlaskit/mention/item';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type { MentionStats } from '@atlaskit/mention';
import {
  TeamMentionHighlight,
  TeamMentionHighlightController,
} from '@atlaskit/mention/spotlight';

import { TeamMember } from '@atlaskit/mention/team-resource';
import {
  buildTypeAheadCancelPayload,
  buildTypeAheadInsertedPayload,
  buildTypeAheadInviteExposurePayload,
  buildTypeAheadInviteItemClickedPayload,
  buildTypeAheadInviteItemViewedPayload,
  buildTypeAheadRenderedPayload,
} from '../analytics';
import InviteItem, { INVITE_ITEM_DESCRIPTION } from '../ui/InviteItem';
import type { TypeAheadHandler, TypeAheadItem } from '../../type-ahead/types';
import {
  isInviteItem,
  isTeamType,
  isTeamStats,
  shouldKeepInviteItem,
} from '../utils';
import { getMentionPluginState } from '../pm-plugins/utils';
import type { FireElementsChannelEvent, TeamInfoAttrAnalytics } from '../types';

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

const withInviteItem = ({
  mentionProvider,
  firstQueryWithoutResults,
  currentQuery,
  onInviteItemMount,
}: {
  firstQueryWithoutResults: string;
  currentQuery: string;
  mentionProvider: MentionProvider;
  onInviteItemMount: () => void;
}) => (mentionItems: Array<TypeAheadItem>) => {
  const inviteItem = createInviteItem({ mentionProvider, onInviteItemMount });
  const keepInviteItem = shouldKeepInviteItem(
    currentQuery,
    firstQueryWithoutResults,
  );
  if (mentionItems.length === 0) {
    return keepInviteItem ? [inviteItem] : [];
  }

  return [
    ...mentionItems,
    // invite item should be shown at the bottom
    inviteItem,
  ];
};

export const mentionToTypeaheadItem = (
  mention: MentionDescription,
): TypeAheadItem => {
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

export function memoize<
  ResultFn extends (mention: MentionDescription) => TypeAheadItem
>(fn: ResultFn): { call: ResultFn; clear(): void } {
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

const buildAndSendElementsTypeAheadAnalytics = (
  fireEvent: FireElementsChannelEvent,
) => ({
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

  if (!isTeamStats(stats)) {
    // is from primary mention endpoint which could be just user mentions or user/team mentions
    duration = stats && stats.duration;
    teams = null;
    userOrTeamIds = mentions.map((mention) => mention.id);
  } else {
    // is from dedicated team-only mention endpoint
    duration = stats && stats.teamMentionDuration;
    userOrTeamIds = null;
    teams = mentions
      .map((mention) =>
        isTeamType(mention.userType)
          ? {
              teamId: mention.id,
              includesYou: mention.context!.includesYou,
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
  );
  fireEvent(payload);
};

const isTeamMentionProvider = (p: any): p is TeamMentionProvider =>
  !!(
    (p as TeamMentionProvider).mentionTypeaheadHighlightEnabled &&
    (p as TeamMentionProvider).mentionTypeaheadCreateTeamPath
  );
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
  const teamLink =
    context && context.teamLink ? context.teamLink : defaultTeamLink;
  const teamLinkNode = schema.text(name!, [
    marks.link.create({ href: teamLink }),
  ]);

  const openBracketText = schema.text('(');
  const closeBracketText = schema.text(')');
  const emptySpaceText = schema.text(' ');

  const inlineNodes: PMNode[] = [teamLinkNode, emptySpaceText, openBracketText];

  const members: TeamMember[] =
    context && context.members ? context.members : [];
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
  HighlightComponent?: React.ComponentType;
  fireEvent: FireElementsChannelEvent;
};
export const createTypeAheadConfig = ({
  sanitizePrivateContent,
  mentionInsertDisplayName,
  fireEvent,
  HighlightComponent,
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

      const pluginState = getMentionPluginState(state);
      const provider = pluginState.mentionProvider;
      if (provider) {
        const teamMentionProvider = provider as TeamMentionProvider;
        if (
          isTeamMentionProvider(teamMentionProvider) &&
          teamMentionProvider.mentionTypeaheadHighlightEnabled()
        ) {
          return (
            <TeamMentionHighlight
              createTeamLink={teamMentionProvider.mentionTypeaheadCreateTeamPath()}
              onClose={() => TeamMentionHighlightController.registerClosed()}
            />
          );
        }
      }
      return null;
    },
    getItems({ query, editorState }) {
      const pluginState = getMentionPluginState(editorState);

      if (!pluginState?.mentionProvider) {
        return Promise.resolve([]);
      }
      const { mentionProvider, contextIdentifierProvider } = pluginState;
      return new Promise((resolve) => {
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
          const mentionItems = mentions.map((mention) =>
            memoizedToItem.call(mention),
          );

          buildAndSendElementsTypeAheadAnalytics(fireEvent)({
            query,
            mentions,
            stats,
          });

          if (mentions.length === 0 && firstQueryWithoutResults === null) {
            firstQueryWithoutResults = query;
          }

          // Growth (El-dorado) experiment design hard requirement
          if (mentionItems.length <= 2) {
            const { inviteExperimentCohort, userRole } = mentionProvider;

            fireEvent(
              buildTypeAheadInviteExposurePayload(
                sessionId,
                contextIdentifierProvider,
                inviteExperimentCohort,
                userRole,
              ),
            );
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
        mentionProvider.subscribe(key, mentionsSubscribeCallback);
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
      const { id, name, nickname, accessLevel, userType } = item.mention;
      const trimmedNickname =
        nickname && nickname.startsWith('@') ? nickname.slice(1) : nickname;
      const renderName =
        mentionInsertDisplayName || !trimmedNickname ? name : trimmedNickname;

      const mentionContext = {
        ...pluginState.contextIdentifierProvider,
        sessionId,
      };

      if (mentionProvider && !isInviteItem(item.mention)) {
        mentionProvider.recordMentionSelection(item.mention, mentionContext);
      }

      const pickerElapsedTime = stats.startedAt
        ? Date.now() - stats.startedAt
        : 0;

      if (
        mentionProvider &&
        mentionProvider.shouldEnableInvite &&
        isInviteItem(item.mention)
      ) {
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
              pluginState.contextIdentifierProvider,
              mentionProvider.userRole,
            ),
          );

          if (mentionProvider.onInviteItemClick) {
            mentionProvider.onInviteItemClick('mention');
          }
        }
        return state.tr;
      }

      fireEvent(
        buildTypeAheadInsertedPayload(
          pickerElapsedTime,
          stats.keyCount.arrowUp,
          stats.keyCount.arrowDown,
          sessionId,
          mode,
          item.mention,
          sourceListItem.map((x) => x.mention),
          query,
          pluginState.contextIdentifierProvider,
        ),
      );

      sessionId = uuid();

      if (mentionProvider && isTeamType(userType)) {
        TeamMentionHighlightController.registerTeamMention();

        return insert(
          buildNodesForTeamMention(
            schema,
            item.mention,
            mentionProvider,
            sanitizePrivateContent,
          ),
        );
      }

      // Don't insert into document if document data is sanitized.
      const text = sanitizePrivateContent ? '' : `@${renderName}`;

      if (
        sanitizePrivateContent &&
        isResolvingMentionProvider(mentionProvider)
      ) {
        // Cache (locally) for later rendering
        mentionProvider.cacheMentionName(id, renderName);
      }

      const mentionNode = schema.nodes.mention.createChecked({
        text,
        id,
        accessLevel,
        userType: userType === 'DEFAULT' ? null : userType,
      });
      const space = schema.text(' ');

      return insert(Fragment.from([mentionNode, space]));
    },
    dismiss({ editorState, query, stats }) {
      firstQueryWithoutResults = null;
      const pickerElapsedTime = stats.startedAt
        ? Date.now() - stats.startedAt
        : 0;

      fireEvent(
        buildTypeAheadCancelPayload(
          pickerElapsedTime,
          stats.keyCount.arrowUp,
          stats.keyCount.arrowDown,
          sessionId,
          query || '',
        ),
      );

      const pluginState = getMentionPluginState(editorState);

      if (pluginState?.mentionProvider) {
        const mentionProvider = pluginState.mentionProvider;

        for (let key of subscriptionKeys) {
          mentionProvider.unsubscribe(key);
        }
      }
      subscriptionKeys.clear();

      sessionId = uuid();
    },
  };

  return typeAhead;
};
