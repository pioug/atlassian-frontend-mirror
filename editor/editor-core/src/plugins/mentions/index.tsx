import React from 'react';
import uuid from 'uuid';
import type { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { ELEMENTS_CHANNEL } from '@atlaskit/mention/resource';
import { mention } from '@atlaskit/adf-schema';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import WithPluginState from '../../ui/WithPluginState';
import { isTypeAheadAllowed } from '../type-ahead/utils';
import ToolbarMention from './ui/ToolbarMention';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { IconMention } from '@atlaskit/editor-common/quick-insert';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import type {
  MentionPluginOptions,
  FireElementsChannelEvent,
  MentionPluginState,
} from './types';
import { createTypeAheadConfig } from './type-ahead';
import { mentionPluginKey } from './pm-plugins/key';
import { createMentionPlugin } from './pm-plugins/main';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { TypeAheadPlugin } from '../type-ahead';

export { mentionPluginKey };

const getSharedState = (
  editorState: EditorState | undefined,
): MentionPluginState | undefined => {
  if (!editorState) {
    return undefined;
  }
  return mentionPluginKey.getState(editorState);
};

const mentionsPlugin: NextEditorPlugin<
  'mention',
  {
    pluginConfiguration: MentionPluginOptions | undefined;
    dependencies: [OptionalPlugin<typeof analyticsPlugin>, TypeAheadPlugin];
    sharedState: MentionPluginState | undefined;
  }
> = ({ config: options, api }) => {
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
                isDisabled={disabled || isTypeAheadAllowed(editorView.state)}
              />
            )
          }
        />
      );
    },

    getSharedState,

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
            const pluginState = getSharedState(state);
            if (pluginState && pluginState.canInsertMention === false) {
              return false;
            }
            api?.typeAhead.commands.openTypeAheadAtCursor({
              triggerHandler: typeAhead,
              inputMethod: INPUT_METHOD.QUICK_INSERT,
            })({ tr });

            api?.analytics?.actions.attachAnalyticsEvent({
              action: ACTION.INVOKED,
              actionSubject: ACTION_SUBJECT.TYPEAHEAD,
              actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_MENTION,
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

export default mentionsPlugin;
