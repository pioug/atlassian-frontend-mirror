import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, Transaction } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';
import { pluginKey } from './plugin-key';
import captionNodeView from './../nodeviews';
import { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import {
  Dispatch,
  EventDispatcher,
} from '@atlaskit/editor-common/event-dispatcher';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  EditorAnalyticsAPI,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type captionPlugin from '../index';

const fireAnalytics = (
  tr: Transaction,
  action: ACTION.DELETED | ACTION.EDITED,
  analyticsApi: EditorAnalyticsAPI | undefined,
) => {
  analyticsApi?.attachAnalyticsEvent({
    action,
    eventType: EVENT_TYPE.TRACK,
    actionSubject: ACTION_SUBJECT.MEDIA_SINGLE,
    actionSubjectId: ACTION_SUBJECT_ID.CAPTION,
  })(tr);
};

export default (
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
  dispatch: Dispatch,
  pluginInjectionApi: ExtractInjectionAPI<typeof captionPlugin> | undefined,
) => {
  const analyticsApi = pluginInjectionApi?.dependencies.analytics?.actions;
  return new SafePlugin({
    appendTransaction(
      transactions: Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ): Transaction | void {
      // only run for transactions that change selection
      if (!transactions.find((tr) => tr.selectionSet)) {
        return;
      }

      const newSelection = !newState.selection.eq(oldState.selection);
      const findCaption = findParentNodeOfType(oldState.schema.nodes.caption);
      const oldSelectionCaption = findCaption(oldState.selection);

      const { tr } = newState;

      // if selecting away from caption, or selecting a different caption
      if (newSelection && oldSelectionCaption) {
        if (oldSelectionCaption.node.childCount === 0) {
          tr.delete(oldSelectionCaption.start - 1, oldSelectionCaption.start);
          tr.setMeta('scrollIntoView', false);
          fireAnalytics(tr, ACTION.DELETED, analyticsApi);
          return tr;
        } else {
          fireAnalytics(tr, ACTION.EDITED, analyticsApi);
          return tr;
        }
      }
    },
    key: pluginKey,
    props: {
      nodeViews: {
        caption: captionNodeView(
          portalProviderAPI,
          eventDispatcher,
          pluginInjectionApi,
        ),
      },
    },
  });
};
