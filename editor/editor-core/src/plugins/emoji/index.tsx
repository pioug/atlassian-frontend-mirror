import React from 'react';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  EditorState,
  SafeStateField,
} from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { emoji } from '@atlaskit/adf-schema';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type { EmojiDescription, EmojiProvider, EmojiId } from '@atlaskit/emoji';
import {
  EmojiTypeAheadItem,
  SearchSort,
  recordSelectionSucceededSli,
  recordSelectionFailedSli,
} from '@atlaskit/emoji';
import type {
  Command,
  NextEditorPlugin,
  PMPluginFactoryParams,
  OptionalPlugin,
  EditorCommand,
} from '@atlaskit/editor-common/types';

import { getInlineNodeViewProducer } from '@atlaskit/editor-common/react-node-view';
import { inputRulePlugin as asciiInputRulePlugin } from './pm-plugins/ascii-input-rules';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { IconEmoji } from '@atlaskit/editor-common/quick-insert';
import { EmojiNodeView } from './nodeviews/emoji';
import type { TypeAheadHandler, TypeAheadItem } from '../type-ahead/types';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import type { EmojiPluginOptions, EmojiPluginState } from './types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { insertEmoji } from './commands/insert-emoji';
import type { TypeAheadPlugin } from '../type-ahead';

export const emojiToTypeaheadItem = (
  emoji: EmojiDescription,
  emojiProvider?: EmojiProvider,
): TypeAheadItem => ({
  title: emoji.shortName || '',
  key: emoji.id || emoji.shortName,
  render({ isSelected, onClick, onHover }) {
    return (
      <EmojiTypeAheadItem
        emoji={emoji}
        selected={isSelected}
        onMouseMove={onHover}
        onSelection={onClick}
        emojiProvider={emojiProvider}
      />
    );
  },
  emoji,
});

export function memoize<
  ResultFn extends (
    emoji: EmojiDescription,
    emojiProvider?: EmojiProvider,
  ) => TypeAheadItem,
>(fn: ResultFn): { call: ResultFn; clear(): void } {
  // Cache results here
  const seen = new Map<string, TypeAheadItem>();

  function memoized(
    emoji: EmojiDescription,
    emojiProvider?: EmojiProvider,
  ): TypeAheadItem {
    // Check cache for hits
    const hit = seen.get(emoji.id || emoji.shortName);

    if (hit) {
      return hit;
    }

    // Generate new result and cache it
    const result = fn(emoji, emojiProvider);
    seen.set(emoji.id || emoji.shortName, result);
    return result;
  }

  return {
    call: memoized as ResultFn,
    clear: seen.clear.bind(seen),
  };
}
const memoizedToItem = memoize(emojiToTypeaheadItem);

export const defaultListLimit = 50;
const isFullShortName = (query?: string) =>
  query &&
  query.length > 1 &&
  query.charAt(0) === ':' &&
  query.charAt(query.length - 1) === ':';

type EmojiProviderChangeHandler = {
  result: (res: { emojis: Array<EmojiDescription> }) => void;
};
const TRIGGER = ':';
export type EmojiPlugin = NextEditorPlugin<
  'emoji',
  {
    pluginConfiguration: EmojiPluginOptions | undefined;
    dependencies: [OptionalPlugin<typeof analyticsPlugin>, TypeAheadPlugin];
    sharedState: EmojiPluginState | undefined;
    commands: {
      insertEmoji: (
        emojiId: EmojiId,
        inputMethod?:
          | INPUT_METHOD.PICKER
          | INPUT_METHOD.ASCII
          | INPUT_METHOD.TYPEAHEAD,
      ) => EditorCommand;
    };
  }
>;

export const emojiPlugin: EmojiPlugin = (options, api) => {
  const typeAhead: TypeAheadHandler = {
    id: TypeAheadAvailableNodes.EMOJI,
    trigger: TRIGGER,
    // Custom regex must have a capture group around trigger
    // so it's possible to use it without needing to scan through all triggers again
    customRegex: '\\(?(:)',
    headless: options ? options.headless : undefined,
    getItems({ query, editorState }) {
      const pluginState = getEmojiPluginState(editorState);
      const emojiProvider = pluginState.emojiProvider;
      if (!emojiProvider) {
        return Promise.resolve([]);
      }

      return new Promise((resolve) => {
        const emojiProviderChangeHandler: EmojiProviderChangeHandler = {
          result(emojiResult) {
            if (!emojiResult || !emojiResult.emojis) {
              resolve([]);
            } else {
              const emojiItems = emojiResult.emojis.map((emoji) =>
                memoizedToItem.call(emoji, emojiProvider),
              );
              resolve(emojiItems);
            }
            emojiProvider.unsubscribe(emojiProviderChangeHandler);
          },
        };

        emojiProvider.subscribe(emojiProviderChangeHandler);

        emojiProvider.filter(TRIGGER.concat(query), {
          limit: defaultListLimit,
          skinTone: emojiProvider.getSelectedTone(),
          sort: !query.length ? SearchSort.UsageFrequency : SearchSort.Default,
        });
      });
    },
    forceSelect({ query, items, editorState }) {
      const { asciiMap } = emojiPluginKey.getState(editorState) || {};
      const normalizedQuery = TRIGGER.concat(query);

      // if the query has space at the end
      // check the ascii map for emojis
      if (
        asciiMap &&
        normalizedQuery.length >= 3 &&
        normalizedQuery.endsWith(' ') &&
        asciiMap.has(normalizedQuery.trim())
      ) {
        const emoji = asciiMap.get(normalizedQuery.trim());
        return { title: emoji?.name || '', emoji };
      }

      const matchedItem = isFullShortName(normalizedQuery)
        ? items.find((item) => item.title.toLowerCase() === normalizedQuery)
        : undefined;
      return matchedItem;
    },
    selectItem(state, item, insert, { mode }) {
      const { id = '', fallback, shortName } = item.emoji;
      const text = fallback || shortName;
      const emojiPluginState = emojiPluginKey.getState(
        state,
      ) as EmojiPluginState;

      if (
        emojiPluginState.emojiProvider &&
        emojiPluginState.emojiProvider.recordSelection &&
        item.emoji
      ) {
        emojiPluginState.emojiProvider
          .recordSelection(item.emoji)
          .then(
            recordSelectionSucceededSli({
              createAnalyticsEvent:
                api?.dependencies.analytics?.sharedState.currentState()
                  ?.createAnalyticsEvent ?? undefined,
            }),
          )
          .catch(
            recordSelectionFailedSli({
              createAnalyticsEvent:
                api?.dependencies.analytics?.sharedState.currentState()
                  ?.createAnalyticsEvent ?? undefined,
            }),
          );
      }
      const emojiNode = state.schema.nodes.emoji.createChecked({
        shortName,
        id,
        text,
      });
      const space = state.schema.text(' ');

      const tr = insert(Fragment.from([emojiNode, space]));
      api?.dependencies.analytics?.actions.attachAnalyticsEvent({
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: ACTION_SUBJECT_ID.EMOJI,
        attributes: { inputMethod: INPUT_METHOD.TYPEAHEAD },
        eventType: EVENT_TYPE.TRACK,
      })(tr);
      return tr;
    },
  };
  return {
    name: 'emoji',

    nodes() {
      return [{ name: 'emoji', node: emoji }];
    },

    pmPlugins() {
      return [
        {
          name: 'emoji',
          plugin: (pmPluginFactoryParams) =>
            createEmojiPlugin(pmPluginFactoryParams),
        },
        {
          name: 'emojiAsciiInputRule',
          plugin: ({ schema, providerFactory, featureFlags }) =>
            asciiInputRulePlugin(
              schema,
              providerFactory,
              featureFlags,
              api?.dependencies.analytics?.actions,
            ),
        },
      ];
    },

    getSharedState(editorState) {
      if (!editorState) {
        return undefined;
      }
      return emojiPluginKey.getState(editorState);
    },

    commands: {
      insertEmoji: insertEmoji(api?.dependencies.analytics?.actions),
    },

    pluginsOptions: {
      quickInsert: ({ formatMessage }) => [
        {
          id: 'emoji',
          title: formatMessage(messages.emoji),
          description: formatMessage(messages.emojiDescription),
          priority: 500,
          keyshortcut: ':',
          icon: () => <IconEmoji />,
          action(insert, state) {
            const tr = insert(undefined);
            api?.dependencies.typeAhead.commands.openTypeAheadAtCursor({
              triggerHandler: typeAhead,
              inputMethod: INPUT_METHOD.QUICK_INSERT,
            })({ tr });

            api?.dependencies.analytics?.actions.attachAnalyticsEvent({
              action: ACTION.INVOKED,
              actionSubject: ACTION_SUBJECT.TYPEAHEAD,
              actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_EMOJI,
              attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
              eventType: EVENT_TYPE.UI,
            })(tr);

            return tr;
          },
        },
      ],
      typeAhead,
    },
  };
};

/**
 * Actions
 */

export const ACTIONS = {
  SET_PROVIDER: 'SET_PROVIDER',
  SET_RESULTS: 'SET_RESULTS',
  SET_ASCII_MAP: 'SET_ASCII_MAP',
};

const setAsciiMap =
  (asciiMap: Map<string, EmojiDescription>): Command =>
  (state, dispatch) => {
    if (dispatch) {
      dispatch(
        state.tr.setMeta(emojiPluginKey, {
          action: ACTIONS.SET_ASCII_MAP,
          params: { asciiMap },
        }),
      );
    }
    return true;
  };

/**
 *
 * Wrapper to call `onLimitReached` when a specified number of calls of that function
 * have been made within a time period.
 *
 * Note: It does not rate limit
 *
 * @param fn Function to wrap
 * @param limitTime Time limit in milliseconds
 * @param limitCount Number of function calls before `onRateReached` is called (per time period)
 * @returns Wrapped function
 */
export function createRateLimitReachedFunction<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LimitedFunction extends (...args: any[]) => any,
>(
  fn: Function,
  limitTime: number,
  limitCount: number,
  onLimitReached: () => void,
): (
  ...args: Parameters<LimitedFunction>
) => ReturnType<LimitedFunction> | undefined {
  let lastCallTime = 0;
  let callCount = 0;

  return function wrappedFn(
    ...args: Parameters<LimitedFunction>
  ): ReturnType<LimitedFunction> | undefined {
    const now = Date.now();
    if (now - lastCallTime < limitTime) {
      if (++callCount > limitCount) {
        onLimitReached?.();
      }
    } else {
      lastCallTime = now;
      callCount = 1;
    }
    return fn(...args);
  };
}

// At this stage console.error only
const logRateWarning = () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error(
      'The emoji provider injected in the Editor is being reloaded frequently, this will cause a slow Editor experience.',
    );
  }
};

export const setProvider: ((provider?: EmojiProvider) => Command) | undefined =
  createRateLimitReachedFunction(
    (provider?: EmojiProvider): Command =>
      (state, dispatch) => {
        if (dispatch) {
          dispatch(
            state.tr.setMeta(emojiPluginKey, {
              action: ACTIONS.SET_PROVIDER,
              params: { provider },
            }),
          );
        }
        return true;
      },
    // If we change the emoji provider more than three times every 5 seconds we should warn.
    // This seems like a really long time but the performance can be that laggy that we don't
    // even get 3 events in 3 seconds and miss this indicator.
    5000,
    3,
    logRateWarning,
  );

export const emojiPluginKey = new PluginKey<EmojiPluginState>('emojiPlugin');

export function getEmojiPluginState(state: EditorState) {
  return (emojiPluginKey.getState(state) || {}) as EmojiPluginState;
}

export function createEmojiPlugin(
  pmPluginFactoryParams: PMPluginFactoryParams,
) {
  return new SafePlugin<EmojiPluginState>({
    key: emojiPluginKey,
    state: {
      init() {
        return {};
      },
      apply(tr, pluginState) {
        const { action, params } = tr.getMeta(emojiPluginKey) || {
          action: null,
          params: null,
        };

        let newPluginState = pluginState;

        switch (action) {
          case ACTIONS.SET_PROVIDER:
            newPluginState = {
              ...pluginState,
              emojiProvider: params.provider,
            };
            pmPluginFactoryParams.dispatch(emojiPluginKey, newPluginState);
            return newPluginState;
          case ACTIONS.SET_ASCII_MAP:
            newPluginState = {
              ...pluginState,
              asciiMap: params.asciiMap,
            };
            pmPluginFactoryParams.dispatch(emojiPluginKey, newPluginState);
            return newPluginState;
        }

        return newPluginState;
      },
    } as SafeStateField<EmojiPluginState>,
    props: {
      nodeViews: {
        emoji: getInlineNodeViewProducer({
          pmPluginFactoryParams,
          Component: EmojiNodeView,
          extraComponentProps: {
            providerFactory: pmPluginFactoryParams.providerFactory,
          },
        }),
      },
    },
    view(editorView) {
      const providerHandler = (
        name: string,
        providerPromise?: Promise<EmojiProvider>,
      ) => {
        switch (name) {
          case 'emojiProvider':
            if (!providerPromise) {
              return setProvider?.(undefined)?.(
                editorView.state,
                editorView.dispatch,
              );
            }

            providerPromise
              .then((provider) => {
                setProvider?.(provider)?.(
                  editorView.state,
                  editorView.dispatch,
                );
                provider.getAsciiMap().then((asciiMap) => {
                  setAsciiMap(asciiMap)(editorView.state, editorView.dispatch);
                });
              })
              .catch(() =>
                setProvider?.(undefined)?.(
                  editorView.state,
                  editorView.dispatch,
                ),
              );
            break;
        }
        return;
      };

      pmPluginFactoryParams.providerFactory.subscribe(
        'emojiProvider',
        providerHandler,
      );

      return {
        destroy() {
          if (pmPluginFactoryParams.providerFactory) {
            pmPluginFactoryParams.providerFactory.unsubscribe(
              'emojiProvider',
              providerHandler,
            );
          }
        },
      };
    },
  });
}
