import React from 'react';
import uuid from 'uuid';
import { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { ELEMENTS_CHANNEL } from '@atlaskit/mention/resource';
import { mention } from '@atlaskit/adf-schema';

import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import { isTypeAheadAllowed } from '../type-ahead/utils';
import ToolbarMention from './ui/ToolbarMention';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../analytics';
import { IconMention } from '../quick-insert/assets';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { MentionPluginOptions, FireElementsChannelEvent } from './types';
import { openTypeAheadAtCursor } from '../type-ahead/transforms/open-typeahead-at-cursor';
import { createTypeAheadConfig } from './type-ahead';
import { mentionPluginKey } from './pm-plugins/key';
import { createMentionPlugin } from './pm-plugins/main';

export { mentionPluginKey };

const mentionsPlugin = (options?: MentionPluginOptions): EditorPlugin => {
  let sessionId = uuid();
  const fireEvent: FireElementsChannelEvent = <T extends AnalyticsEventPayload>(
    payload: T,
  ): void => {
    if (!options?.createAnalyticsEvent) {
      return;
    }
    const { createAnalyticsEvent } = options;

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
          plugin: ({
            providerFactory,
            dispatch,
            portalProviderAPI,
            eventDispatcher,
          }) =>
            createMentionPlugin(
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
            openTypeAheadAtCursor({
              triggerHandler: typeAhead,
              inputMethod: INPUT_METHOD.QUICK_INSERT,
            })(tr);
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
      typeAhead,
    },
  };
};

export default mentionsPlugin;
