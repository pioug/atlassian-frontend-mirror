/**
 * A plugin for handle table custom widths
 * Has login to scan the document, add width value to table's width attribute when necessary
 * Also holds resizing state to hide / show table controls
 */

import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import {
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { findTable } from '@atlaskit/editor-tables/utils';

import { TABLE_MAX_WIDTH } from './table-resizing/utils';

type __ReplaceStep = ReplaceStep & {
  // Properties `to` and `from` are private attributes of ReplaceStep.
  to: number;
  from: number;
};

type TableWidthPluginState = {
  resizing: boolean;
};

export const pluginKey = new PluginKey<TableWidthPluginState>(
  'tableWidthPlugin',
);

const createPlugin = (
  dispatch: Dispatch,
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  fullWidthEnabled: boolean,
  getEditorFeatureFlags?: GetEditorFeatureFlags,
) => {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init() {
        return {
          resizing: false,
        };
      },
      apply(tr, pluginState) {
        const meta = tr.getMeta(pluginKey);
        if (meta && meta.resizing !== pluginState.resizing) {
          const newState = { resizing: meta.resizing };

          dispatch(pluginKey, newState);
          return newState;
        }

        return pluginState;
      },
    },
    appendTransaction: (transactions, oldState, newState) => {
      // do not fire select table analytics events when a table is being created or deleted
      const selectedTableOldState = findTable(oldState.selection);
      const selectedTableNewState = findTable(newState.selection);

      /**
       * Select table event
       *   condition: 1
       * When users selection changes to table
       */
      if (!selectedTableOldState && selectedTableNewState) {
        dispatchAnalyticsEvent({
          action: ACTION.SELECTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          actionSubjectId: ACTION_SUBJECT_ID.TABLE,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            localId: selectedTableNewState.node.attrs.localId || '',
          },
        });
      }

      // When document first load in Confluence, initially it is an empty document
      // and Collab service triggers a transaction to replace the empty document with the real document that should be rendered.
      // what we need to do is to add width attr to all tables in the real document
      // isReplaceDocumentOperation is checking if the transaction is the one that replace the empty document with the real document
      const isReplaceDocumentOperation = transactions.some((tr) => {
        if (tr.getMeta('replaceDocument')) {
          return true;
        }

        const hasStepReplacingEntireDocument = tr.steps.some((step) => {
          if (!(step instanceof ReplaceStep)) {
            return false;
          }

          const isStepReplacingFromDocStart =
            (step as __ReplaceStep).from === 0;
          const isStepReplacingUntilTheEndOfDocument =
            (step as __ReplaceStep).to === oldState.doc.content.size;

          if (
            !isStepReplacingFromDocStart ||
            !isStepReplacingUntilTheEndOfDocument
          ) {
            return false;
          }
          return true;
        });

        return hasStepReplacingEntireDocument;
      });

      const referentialityTr = transactions.find((tr) =>
        tr.getMeta('referentialityTableInserted'),
      );

      const shouldPatchTable =
        fullWidthEnabled &&
        getEditorFeatureFlags &&
        getEditorFeatureFlags()['tablePreserveWidth'];

      if (
        !isReplaceDocumentOperation &&
        (!shouldPatchTable || !referentialityTr)
      ) {
        return null;
      }

      const { table } = newState.schema.nodes;
      const tr = newState.tr;

      /**
       * Select table event
       *   condition: 2
       * Users selection defaults to table, if first node
       */
      if (selectedTableOldState) {
        dispatchAnalyticsEvent({
          action: ACTION.SELECTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          actionSubjectId: ACTION_SUBJECT_ID.TABLE,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            localId: selectedTableOldState.node.attrs.localId || '',
          },
        });
      }

      if (isReplaceDocumentOperation) {
        newState.doc.forEach((node, offset) => {
          if (node.type === table) {
            const width = node.attrs.width;
            const layout = node.attrs.layout;

            if (!width && layout) {
              let tableWidthCal;

              if (fullWidthEnabled) {
                tableWidthCal = akEditorFullWidthLayoutWidth;
              } else {
                switch (layout) {
                  case 'wide':
                    tableWidthCal = akEditorWideLayoutWidth;
                    break;
                  case 'full-width':
                    tableWidthCal = akEditorFullWidthLayoutWidth;
                    break;
                  // when in fix-width appearance, no need to assign value to table width attr
                  // as when table is created, width attr is null by default, table rendered using layout attr
                  default:
                    tableWidthCal = akEditorDefaultLayoutWidth;
                    break;
                }
              }

              const { width, ...rest } = node.attrs;

              if (tableWidthCal) {
                tr.step(
                  new SetAttrsStep(offset, {
                    width: tableWidthCal,
                    ...rest,
                  }),
                );
              }
            }
          }
        });
      }

      if (referentialityTr) {
        referentialityTr.steps.forEach((step) => {
          step.getMap().forEach((oldStart, oldEnd, newStart, newEnd) => {
            newState.doc.nodesBetween(newStart, newEnd, (node, pos) => {
              if (node.type === table && node.attrs.width !== TABLE_MAX_WIDTH) {
                tr.setNodeAttribute(pos, 'width', TABLE_MAX_WIDTH);
              }
            });
          });
        });
      }

      return tr;
    },
  });
};

export { createPlugin };
