import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import type {
  Fragment,
  Node,
  NodeType,
  ResolvedPos,
  Schema,
} from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import {
  NodeSelection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import { canInsert } from '@atlaskit/editor-prosemirror/utils';
import type { InputRuleWrapper } from '@atlaskit/prosemirror-input-rules';
import {
  createPlugin,
  createRule,
  leafNodeReplacementCharacter,
} from '@atlaskit/prosemirror-input-rules';

import {
  changeInDepth,
  getListTypes,
  insertTaskDecisionAction,
} from '../commands';
import type {
  AddItemAttrs,
  AddItemTransactionCreator,
  GetContextIdentifier,
  TaskDecisionListType,
} from '../types';

const createListRule =
  (
    editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
    getContextIdentifierProvider: GetContextIdentifier,
  ) =>
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

        const insertTr = insertTaskDecisionAction(
          editorAnalyticsAPI,
          getContextIdentifierProvider,
        )(
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

const isCursorInsideList = ($pos: ResolvedPos): boolean => {
  return $pos.node($pos.depth - 1)?.type.name === 'listItem';
};

const processShortcutForNestedTask = (
  content: Fragment,
  $from: ResolvedPos,
  tr: Transaction,
  list: NodeType,
  item: NodeType,
  listLocalId: string,
  itemLocalId: string,
  itemAttrs?: AddItemAttrs,
): void => {
  //Extracting the content into the 'contentWithoutShortcut' from 'content' after removing the keyboard shortcut text, i.e., '[] '.
  const contentWithoutShortcut = content.cut(
    $from.pos - $from.start(),
    content.size,
  );

  tr.insert(
    $from.after(),
    list.create({ localId: listLocalId }, [
      item.create(
        { localId: itemLocalId, ...itemAttrs },
        contentWithoutShortcut,
      ),
    ]),
  )
    .setSelection(new TextSelection(tr.doc.resolve($from.after())))
    .delete($from.start(), $from.end());
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
      if (isCursorInsideList($from)) {
        processShortcutForNestedTask(
          content,
          $from,
          tr,
          list,
          item,
          listLocalId,
          itemLocalId,
          itemAttrs,
        );

        return tr;
      }

      tr.replaceRangeWith(
        $from.before(),
        $from.after(),
        list.create({ localId: listLocalId }, [
          item.create({ localId: itemLocalId, ...itemAttrs }, content),
        ]),
      )
        .delete(start + 1, end + 1)
        .setSelection(new TextSelection(tr.doc.resolve(start + 1)));

      return tr;
    }

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

    return tr;
  };

export const inputRulePlugin =
  (
    editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
    getContextIdentifierProvider: GetContextIdentifier,
  ) =>
  (schema: Schema, featureFlags: FeatureFlags): SafePlugin => {
    const rules: InputRuleWrapper[] = [];

    const { decisionList, decisionItem, taskList, taskItem } = schema.nodes;

    if (decisionList && decisionItem) {
      rules.push(
        createListRule(editorAnalyticsAPI, getContextIdentifierProvider)(
          new RegExp(`(^|${leafNodeReplacementCharacter})\\<\\>\\s$`),
          'decisionList',
        ),
      );
    }

    if (taskList && taskItem) {
      rules.push(
        createListRule(editorAnalyticsAPI, getContextIdentifierProvider)(
          new RegExp(`(^|${leafNodeReplacementCharacter})\\[\\]\\s$`),
          'taskList',
        ),
      );
      rules.push(
        createListRule(editorAnalyticsAPI, getContextIdentifierProvider)(
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
