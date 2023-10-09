import React from 'react';
import uuid from 'uuid';
import type { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { ELEMENTS_CHANNEL } from '@atlaskit/mention/resource';
import { mention } from '@atlaskit/adf-schema';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type {
  NextEditorPlugin,
  OptionalPlugin,
  TypeAheadHandler,
} from '@atlaskit/editor-common/types';
import { WithPluginState } from '@atlaskit/editor-common/with-plugin-state';
import ToolbarMention from './ui/ToolbarMention';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { IconMention } from '@atlaskit/editor-common/quick-insert';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type {
  MentionPluginOptions,
  FireElementsChannelEvent,
  MentionPluginState,
} from './types';
import { createTypeAheadConfig } from './type-ahead';
import { mentionPluginKey } from './pm-plugins/key';
import { createMentionPlugin } from './pm-plugins/main';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type {
  TypeAheadPlugin,
  TypeAheadInputMethod,
} from '@atlaskit/editor-plugin-type-ahead';

export { mentionPluginKey };

export type MentionSharedState = MentionPluginState & {
  typeAheadHandler: TypeAheadHandler;
};
export type MentionPlugin = NextEditorPlugin<
  'mention',
  {
    pluginConfiguration: MentionPluginOptions | undefined;
    dependencies: [OptionalPlugin<typeof analyticsPlugin>, TypeAheadPlugin];
    sharedState: MentionSharedState | undefined;
    actions: {
      openTypeAhead: (inputMethod: TypeAheadInputMethod) => boolean;
    };
  }
>;

const mentionsPlugin: MentionPlugin = ({ config: options, api }) => {
  let sessionId = uuid();
  const fireEvent: FireElementsChannelEvent = <T extends AnalyticsEventPayload>(
    payload: T,
  ): void => {
    const { createAnalyticsEvent } =
      api?.analytics?.sharedState.currentState() ?? {};
    if (!createAnalyticsEvent) {
      return;
    }

    if (payload.attributes && !payload.attributes.sessionId) {
      payload.attributes.sessionId = sessionId;
    }

    createAnalyticsEvent(payload).fire(ELEMENTS_CHANNEL);
  };
  const typeAhead = createTypeAheadConfig({
    sanitizePrivateContent: options?.sanitizePrivateContent,
    mentionInsertDisplayName: options?.insertDisplayName,
    HighlightComponent: options?.HighlightComponent,
    fireEvent,
  });

  return {
    name: 'mention',

    nodes() {
      return [{ name: 'mention', node: mention }];
    },

    pmPlugins() {
      return [
        {
          name: 'mention',
          plugin: (pmPluginFactoryParams) =>
            createMentionPlugin(pmPluginFactoryParams, fireEvent, options),
        },
      ];
    },

    secondaryToolbarComponent({ editorView, disabled }) {
      const openMentionTypeAhead = () => {
        api?.typeAhead?.actions?.open({
          triggerHandler: typeAhead,
          inputMethod: INPUT_METHOD.INSERT_MENU,
        });
      };

      return (
        <WithPluginState
          editorView={editorView}
          plugins={{
            mentionState: mentionPluginKey,
          }}
          render={({ mentionState = {} }) =>
            !mentionState.mentionProvider ? null : (
              <ToolbarMention
                editorView={editorView}
                onInsertMention={openMentionTypeAhead}
                isDisabled={
                  disabled || api?.typeAhead.actions.isAllowed(editorView.state)
                }
              />
            )
          }
        />
      );
    },

    actions: {
      openTypeAhead(inputMethod: TypeAheadInputMethod) {
        return Boolean(
          api?.typeAhead?.actions?.open({
            triggerHandler: typeAhead,
            inputMethod,
          }),
        );
      },
    },

    getSharedState(
      editorState: EditorState | undefined,
    ): MentionSharedState | undefined {
      if (!editorState) {
        return undefined;
      }

      const mentionPluginState = mentionPluginKey.getState(editorState);
      return {
        ...mentionPluginState,
        typeAheadHandler: typeAhead,
      };
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
          icon: () => <IconMention />,
          action(insert, state) {
            const tr = insert(undefined);
            const pluginState = mentionPluginKey.getState(state);
            if (pluginState && pluginState.canInsertMention === false) {
              return false;
            }

            api?.typeAhead.actions.openAtTransaction({
              triggerHandler: typeAhead,
              inputMethod: INPUT_METHOD.QUICK_INSERT,
            })(tr);

            return tr;
          },
        },
      ],
      typeAhead,
    },
  };
};

export default mentionsPlugin;
