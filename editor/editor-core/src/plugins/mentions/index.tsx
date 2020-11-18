import React from 'react';
import uuid from 'uuid';
import { Fragment, Node, Schema } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, StateField } from 'prosemirror-state';
import debounce from 'lodash/debounce';
import { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import {
  ELEMENTS_CHANNEL,
  isResolvingMentionProvider,
  MentionDescription,
  SLI_EVENT_TYPE,
  buildSliPayload,
  MentionProvider,
  TeamMentionProvider,
} from '@atlaskit/mention/resource';
import {
  TeamMentionHighlight,
  TeamMentionHighlightController,
} from '@atlaskit/mention/spotlight';
import { MentionItem } from '@atlaskit/mention/item';
import { TeamMember } from '@atlaskit/mention/team-resource';
import { mention } from '@atlaskit/adf-schema';
import {
  ContextIdentifierProvider,
  ProviderFactory,
} from '@atlaskit/editor-common';

import { Command, EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';
import { PortalProviderAPI } from '../../ui/PortalProvider';
import WithPluginState from '../../ui/WithPluginState';
import {
  createInitialPluginState,
  pluginKey as typeAheadPluginKey,
  PluginState as TypeAheadPluginState,
} from '../type-ahead/pm-plugins/main';
import InviteItem, { INVITE_ITEM_DESCRIPTION } from './ui/InviteItem';
import ToolbarMention from './ui/ToolbarMention';
import mentionNodeView from './nodeviews/mention';
import {
  buildTypeAheadCancelPayload,
  buildTypeAheadInsertedPayload,
  buildTypeAheadInviteExposurePayload,
  buildTypeAheadInviteItemClickedPayload,
  buildTypeAheadInviteItemViewedPayload,
  buildTypeAheadRenderedPayload,
} from './analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  AnalyticsDispatch,
  analyticsPluginKey,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../analytics';
import { TypeAheadItem } from '../type-ahead/types';
import { isInviteItem, isTeamStats, isTeamType } from './utils';
import { IconMention } from '../quick-insert/assets';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import {
  MentionPluginOptions,
  MentionPluginState,
  TeamInfoAttrAnalytics,
} from './types';
import { analyticsEventKey } from '../analytics/consts';
import { EventDispatcher } from '../../event-dispatcher';

const EMPTY: MentionDescription[] = [];

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

const mentionsPlugin = (options?: MentionPluginOptions): EditorPlugin => {
  let sessionId = uuid();
  const fireEvent = <T extends AnalyticsEventPayload>(payload: T): void => {
    if (options && options.createAnalyticsEvent) {
      if (payload.attributes && !payload.attributes.sessionId) {
        payload.attributes.sessionId = sessionId;
      }
      options.createAnalyticsEvent(payload).fire(ELEMENTS_CHANNEL);
    }
  };

  let shouldTrackInviteItemExposure = false;
  let inviteExperimentLastQueryWithResults = '';
  const debouncedFireEvent = debounce(fireEvent, 200);

  return {
    name: 'mention',

    nodes() {
      return [{ name: 'mention', node: mention }];
    },

    pmPlugins() {
      return [
        {
          name: 'mention',
          plugin: ({
            providerFactory,
            dispatch,
            portalProviderAPI,
            eventDispatcher,
          }) =>
            mentionPluginFactory(
              dispatch,
              providerFactory,
              portalProviderAPI,
              eventDispatcher,
              fireEvent,
              options,
            ),
        },
      ];
    },

    secondaryToolbarComponent({ editorView, disabled }) {
      return (
        <WithPluginState
          editorView={editorView}
          plugins={{
            typeAheadState: typeAheadPluginKey,
            mentionState: mentionPluginKey,
          }}
          render={({
            typeAheadState = createInitialPluginState(),
            mentionState = {},
          }: {
            typeAheadState: TypeAheadPluginState;
            mentionState: MentionPluginState;
          }) =>
            !mentionState.mentionProvider ? null : (
              <ToolbarMention
                editorView={editorView}
                isDisabled={disabled || !typeAheadState.isAllowed}
              />
            )
          }
        />
      );
    },

    pluginsOptions: {
      quickInsert: ({ formatMessage }) => [
        {
          id: 'mention',
          title: formatMessage(messages.mention),
          description: formatMessage(messages.mentionDescription),
          keywords: ['team', 'user'],
          priority: 400,
          keyshortcut: '@',
          icon: () => <IconMention label={formatMessage(messages.mention)} />,
          action(insert, state) {
            const mark = state.schema.mark('typeAheadQuery', {
              trigger: '@',
            });
            const mentionText = state.schema.text('@', [mark]);
            const tr = insert(mentionText);
            return addAnalytics(state, tr, {
              action: ACTION.INVOKED,
              actionSubject: ACTION_SUBJECT.TYPEAHEAD,
              actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_MENTION,
              attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
              eventType: EVENT_TYPE.UI,
            });
          },
        },
      ],
      typeAhead: {
        trigger: '@',
        // Custom regex must have a capture group around trigger
        // so it's possible to use it without needing to scan through all triggers again
        customRegex: '\\(?(@)',
        getHighlight: (state: EditorState) => {
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
                  onClose={() =>
                    TeamMentionHighlightController.registerClosed()
                  }
                />
              );
            }
          }
          return null;
        },
        getItems(
          query,
          state,
          _intl,
          { prevActive, queryChanged },
          tr,
          dispatch,
        ) {
          if (!prevActive && queryChanged && !tr.getMeta(analyticsPluginKey)) {
            // Clear cache on first invoke to reduce memory leaks
            memoizedToItem.clear();

            (dispatch as AnalyticsDispatch)(analyticsEventKey, {
              payload: {
                action: ACTION.INVOKED,
                actionSubject: ACTION_SUBJECT.TYPEAHEAD,
                actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_MENTION,
                attributes: { inputMethod: INPUT_METHOD.KEYBOARD },
                eventType: EVENT_TYPE.UI,
              },
            });
          }

          const pluginState = getMentionPluginState(state);
          const mentions =
            !prevActive && queryChanged ? EMPTY : pluginState.mentions || EMPTY;

          const mentionContext = {
            ...pluginState.contextIdentifierProvider,
            sessionId,
          };

          if (queryChanged && pluginState.mentionProvider) {
            // get ready to track invite item exposure once re-fetched is just invoked
            shouldTrackInviteItemExposure = true;
            pluginState.mentionProvider.filter(query || '', mentionContext);
          }

          const mentionItems = mentions.map(mention =>
            memoizedToItem.call(mention),
          );

          // to show invite teammate item only if there is 2 or less mentionable user/team available
          if (pluginState.mentionProvider && !!query && mentions.length <= 2) {
            const {
              shouldEnableInvite,
              userRole,
            } = pluginState.mentionProvider;

            if (shouldTrackInviteItemExposure) {
              // we don't want to overly fire the exposure event for each continuous key press
              debouncedFireEvent(
                buildTypeAheadInviteExposurePayload(
                  !!shouldEnableInvite,
                  sessionId,
                  pluginState.contextIdentifierProvider,
                  userRole,
                ),
              );
              shouldTrackInviteItemExposure = false;
            }

            if (shouldEnableInvite) {
              if (mentions.length > 0) {
                inviteExperimentLastQueryWithResults = query;
              }

              const querySuffix = query.slice(
                inviteExperimentLastQueryWithResults.length,
              );

              if (querySuffix.indexOf(' ') > -1) {
                return mentionItems;
              }

              return [
                ...mentionItems,
                // invite item should be shown at the bottom
                {
                  title: INVITE_ITEM_DESCRIPTION.id,
                  render: ({ isSelected, onClick, onHover }) => (
                    <InviteItem
                      productName={
                        pluginState.mentionProvider
                          ? pluginState.mentionProvider.productName
                          : undefined
                      }
                      selected={isSelected}
                      onMount={() => {
                        fireEvent(
                          buildTypeAheadInviteItemViewedPayload(
                            sessionId,
                            pluginState.contextIdentifierProvider,
                            userRole,
                          ),
                        );
                      }}
                      onMouseEnter={onHover}
                      onSelection={onClick}
                      userRole={userRole}
                    />
                  ),
                  mention: INVITE_ITEM_DESCRIPTION,
                },
              ];
            }
          }

          return mentionItems;
        },
        selectItem(state, item, insert, { mode }) {
          inviteExperimentLastQueryWithResults = '';
          const sanitizePrivateContent =
            options && options.sanitizePrivateContent;
          const mentionInsertDisplayName =
            options && options.mentionInsertDisplayName;

          const { schema } = state;

          const pluginState = getMentionPluginState(state);
          const { mentionProvider } = pluginState;
          const { id, name, nickname, accessLevel, userType } = item.mention;
          const trimmedNickname =
            nickname && nickname.startsWith('@') ? nickname.slice(1) : nickname;
          const renderName =
            mentionInsertDisplayName || !trimmedNickname
              ? name
              : trimmedNickname;
          const typeAheadPluginState = typeAheadPluginKey.getState(
            state,
          ) as TypeAheadPluginState;

          const mentionContext = {
            ...pluginState.contextIdentifierProvider,
            sessionId,
          };

          if (mentionProvider && !isInviteItem(item.mention)) {
            mentionProvider.recordMentionSelection(
              item.mention,
              mentionContext,
            );
          }

          const pickerElapsedTime = typeAheadPluginState.queryStarted
            ? Date.now() - typeAheadPluginState.queryStarted
            : 0;

          if (
            mentionProvider &&
            mentionProvider.shouldEnableInvite &&
            isInviteItem(item.mention)
          ) {
            // fire a different ui event for invite teammate item to prevent from data pollution
            fireEvent(
              buildTypeAheadInviteItemClickedPayload(
                pickerElapsedTime,
                typeAheadPluginState.upKeyCount,
                typeAheadPluginState.downKeyCount,
                sessionId,
                mode,
                typeAheadPluginState.query || '',
                pluginState.contextIdentifierProvider,
                mentionProvider.userRole,
              ),
            );

            if (mentionProvider.onInviteItemClick) {
              mentionProvider.onInviteItemClick('mention');
            }

            return state.tr;
          }

          fireEvent(
            buildTypeAheadInsertedPayload(
              pickerElapsedTime,
              typeAheadPluginState.upKeyCount,
              typeAheadPluginState.downKeyCount,
              sessionId,
              mode,
              item.mention,
              pluginState.mentions,
              typeAheadPluginState.query || '',
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

          return insert(
            schema.nodes.mention.createChecked({
              text,
              id,
              accessLevel,
              userType: userType === 'DEFAULT' ? null : userType,
            }),
          );
        },
        dismiss(state) {
          inviteExperimentLastQueryWithResults = '';
          const typeAheadPluginState = typeAheadPluginKey.getState(
            state,
          ) as TypeAheadPluginState;

          const pickerElapsedTime = typeAheadPluginState.queryStarted
            ? Date.now() - typeAheadPluginState.queryStarted
            : 0;

          fireEvent(
            buildTypeAheadCancelPayload(
              pickerElapsedTime,
              typeAheadPluginState.upKeyCount,
              typeAheadPluginState.downKeyCount,
              sessionId,
              typeAheadPluginState.query || '',
            ),
          );

          sessionId = uuid();
        },
      },
    },
  };
};

export default mentionsPlugin;

/**
 * Actions
 */

export const ACTIONS = {
  SET_PROVIDER: 'SET_PROVIDER',
  SET_RESULTS: 'SET_RESULTS',
  SET_CONTEXT: 'SET_CONTEXT',
};

export const setProvider = (provider: MentionProvider | undefined): Command => (
  state,
  dispatch,
) => {
  if (dispatch) {
    dispatch(
      state.tr.setMeta(mentionPluginKey, {
        action: ACTIONS.SET_PROVIDER,
        params: { provider },
      }),
    );
  }
  return true;
};

export const setResults = (results: MentionDescription[]): Command => (
  state,
  dispatch,
) => {
  if (dispatch) {
    dispatch(
      state.tr.setMeta(mentionPluginKey, {
        action: ACTIONS.SET_RESULTS,
        params: { results },
      }),
    );
  }
  return true;
};

export const setContext = (
  context: ContextIdentifierProvider | undefined,
): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(
      state.tr.setMeta(mentionPluginKey, {
        action: ACTIONS.SET_CONTEXT,
        params: { context },
      }),
    );
  }
  return true;
};

/**
 *
 * ProseMirror Plugin
 *
 */

export const mentionPluginKey = new PluginKey('mentionPlugin');

export function getMentionPluginState(state: EditorState) {
  return mentionPluginKey.getState(state) as MentionPluginState;
}

function mentionPluginFactory(
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  fireEvent: (payload: any) => void,
  options?: MentionPluginOptions,
) {
  let mentionProvider: MentionProvider;

  const sendAnalytics = (
    event: string,
    actionSubject: string,
    action: string,
  ): void => {
    if (event === SLI_EVENT_TYPE) {
      fireEvent(buildSliPayload(actionSubject, action));
    }
  };

  return new Plugin({
    key: mentionPluginKey,
    state: {
      init() {
        return {};
      },
      apply(tr, pluginState) {
        const { action, params } = tr.getMeta(mentionPluginKey) || {
          action: null,
          params: null,
        };

        let newPluginState = pluginState;

        switch (action) {
          case ACTIONS.SET_PROVIDER:
            newPluginState = {
              ...pluginState,
              mentionProvider: params.provider,
            };
            dispatch(mentionPluginKey, newPluginState);

            return newPluginState;

          case ACTIONS.SET_RESULTS:
            newPluginState = {
              ...pluginState,
              mentions: params.results,
            };
            dispatch(mentionPluginKey, newPluginState);
            return newPluginState;

          case ACTIONS.SET_CONTEXT:
            newPluginState = {
              ...pluginState,
              contextIdentifierProvider: params.context,
            };
            dispatch(mentionPluginKey, newPluginState);
            return newPluginState;
        }

        return newPluginState;
      },
    } as StateField<MentionPluginState>,
    props: {
      nodeViews: {
        mention: mentionNodeView(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          options,
        ),
      },
    },
    view(editorView) {
      const providerHandler = (
        name: string,
        providerPromise?: Promise<MentionProvider | ContextIdentifierProvider>,
      ) => {
        switch (name) {
          case 'mentionProvider':
            if (!providerPromise) {
              return setProvider(undefined)(
                editorView.state,
                editorView.dispatch,
              );
            }

            (providerPromise as Promise<MentionProvider>)
              .then(provider => {
                if (mentionProvider) {
                  mentionProvider.unsubscribe('mentionPlugin');
                }

                mentionProvider = provider;
                setProvider(provider)(editorView.state, editorView.dispatch);

                provider.subscribe(
                  'mentionPlugin',
                  (mentions, query, stats) => {
                    setResults(mentions)(editorView.state, editorView.dispatch);

                    let duration: number = 0;
                    let userOrTeamIds: string[] | null = null;
                    let teams: TeamInfoAttrAnalytics[] | null = null;

                    if (!isTeamStats(stats)) {
                      // is from primary mention endpoint which could be just user mentions or user/team mentions
                      duration = stats && stats.duration;
                      teams = null;
                      userOrTeamIds = mentions.map(mention => mention.id);
                    } else {
                      // is from dedicated team-only mention endpoint
                      duration = stats && stats.teamMentionDuration;
                      userOrTeamIds = null;
                      teams = mentions
                        .map(mention =>
                          isTeamType(mention.userType)
                            ? {
                                teamId: mention.id,
                                includesYou: mention.context!.includesYou,
                                memberCount: mention.context!.memberCount,
                              }
                            : null,
                        )
                        .filter(m => !!m) as TeamInfoAttrAnalytics[];
                    }

                    const payload = buildTypeAheadRenderedPayload(
                      duration,
                      userOrTeamIds,
                      query || '',
                      teams,
                    );
                    fireEvent(payload);
                  },
                  undefined,
                  undefined,
                  undefined,
                  sendAnalytics,
                );
              })
              .catch(() =>
                setProvider(undefined)(editorView.state, editorView.dispatch),
              );
            break;

          case 'contextIdentifierProvider':
            if (!providerPromise) {
              return setContext(undefined)(
                editorView.state,
                editorView.dispatch,
              );
            }
            (providerPromise as Promise<ContextIdentifierProvider>).then(
              provider => {
                setContext(provider)(editorView.state, editorView.dispatch);
              },
            );
            break;
        }
        return;
      };

      providerFactory.subscribe('mentionProvider', providerHandler);
      providerFactory.subscribe('contextIdentifierProvider', providerHandler);

      return {
        destroy() {
          if (providerFactory) {
            providerFactory.unsubscribe('mentionProvider', providerHandler);
            providerFactory.unsubscribe(
              'contextIdentifierProvider',
              providerHandler,
            );
          }
          if (mentionProvider) {
            mentionProvider.unsubscribe('mentionPlugin');
          }
        },
      };
    },
  });
}

/**
 * When a team mention is selected, we render a team link and list of member/user mentions
 * in editor content
 */
function buildNodesForTeamMention(
  schema: Schema,
  selectedMention: MentionDescription,
  mentionProvider: MentionProvider,
  sanitizePrivateContent?: boolean,
): Fragment {
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

  const inlineNodes: Node[] = [teamLinkNode, emptySpaceText, openBracketText];

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
}

const isTeamMentionProvider = (p: any): p is TeamMentionProvider =>
  !!(
    (p as TeamMentionProvider).mentionTypeaheadHighlightEnabled &&
    (p as TeamMentionProvider).mentionTypeaheadCreateTeamPath
  );
