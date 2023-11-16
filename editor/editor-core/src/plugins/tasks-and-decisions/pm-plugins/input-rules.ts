import type { InputRuleWrapper } from '@atlaskit/prosemirror-input-rules';
import type { FeatureFlags } from '../../../types/feature-flags';
import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
  NodeSelection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import { canInsert } from '@atlaskit/editor-prosemirror/utils';

import {
  createRule,
  createPlugin,
  leafNodeReplacementCharacter,
} from '@atlaskit/prosemirror-input-rules';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
  changeInDepth,
  insertTaskDecisionAction,
  getListTypes,
} from '../commands';
import type {
  AddItemAttrs,
  AddItemTransactionCreator,
  TaskDecisionListType,
} from '../types';

const createListRule =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (regex: RegExp, listType: TaskDecisionListType, itemAttrs?: AddItemAttrs) => {
    return createRule(
      regex,
      (
        state: EditorState,
        _match: Object | undefined,
        start: number,
        end: number,
      ) => {
        const { paragraph } = state.schema.nodes;
        const { list } = getListTypes(listType, state.schema);
        const $end = state.doc.resolve(end);
        const $endOfParent = state.doc.resolve($end.after());
        // Only allow creating list in nodes that support them.
        // Parent must be a paragraph as we don't want this applying to headings
        if (
          $end.parent.type !== paragraph ||
          !canInsert($endOfParent, list.createAndFill() as Node)
        ) {
          return null;
        }

        const insertTr = insertTaskDecisionAction(editorAnalyticsAPI)(
          state,
          listType,
          INPUT_METHOD.FORMATTING,
          addItem(start, end),
          undefined,
          undefined,
          itemAttrs,
        );

        return insertTr;
      },
    );
  };

const addItem =
  (start: number, end: number): AddItemTransactionCreator =>
  ({ tr, state, list, item, listLocalId, itemLocalId, itemAttrs }) => {
    const {
      selection: { $from },
      schema,
    } = state;
    const { hardBreak } = schema.nodes;

    const content = $from.node($from.depth).content;
    let shouldBreakNode = false;
    content.forEach((node, offset) => {
      if (node.type === hardBreak && offset < start) {
        shouldBreakNode = true;
      }
    });

    if (!shouldBreakNode) {
      tr.replaceRangeWith(
        $from.before(),
        $from.after(),
        list.create({ localId: listLocalId }, [
          item.create({ localId: itemLocalId, ...itemAttrs }, content),
        ]),
      )
        .delete(start + 1, end + 1)
        .setSelection(new TextSelection(tr.doc.resolve(start + 1)));
    } else {
      const depthAdjustment = changeInDepth($from, tr.selection.$from);
      tr.split($from.pos)
        .setSelection(new NodeSelection(tr.doc.resolve($from.pos + 1)))
        .replaceSelectionWith(
          list.create({ localId: listLocalId }, [
            item.create(
              { localId: itemLocalId, ...itemAttrs },
              // TODO: [ts30] handle void and null properly
              (tr.doc.nodeAt($from.pos + 1) as Node).content,
            ),
          ]),
        )
        .setSelection(
          new TextSelection(tr.doc.resolve($from.pos + depthAdjustment)),
        )
        .delete(start, end + 1);
    }
    return tr;
  };

export const inputRulePlugin =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (schema: Schema, featureFlags: FeatureFlags): SafePlugin => {
    const rules: InputRuleWrapper[] = [];

    const { decisionList, decisionItem, taskList, taskItem } = schema.nodes;

    if (decisionList && decisionItem) {
      rules.push(
        createListRule(editorAnalyticsAPI)(
          new RegExp(`(^|${leafNodeReplacementCharacter})\\<\\>\\s$`),
          'decisionList',
        ),
      );
    }

    if (taskList && taskItem) {
      rules.push(
        createListRule(editorAnalyticsAPI)(
          new RegExp(`(^|${leafNodeReplacementCharacter})\\[\\]\\s$`),
          'taskList',
        ),
      );
      rules.push(
        createListRule(editorAnalyticsAPI)(
          new RegExp(`(^|${leafNodeReplacementCharacter})\\[x\\]\\s$`),
          'taskList',
          { state: 'DONE' },
        ),
      );
    }

    return createPlugin('tasks-and-decisions', rules, {
      isBlockNodeRule: true,
    });
  };

export default inputRulePlugin;
