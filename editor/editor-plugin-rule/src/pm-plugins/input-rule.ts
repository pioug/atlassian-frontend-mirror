import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { safeInsert } from '@atlaskit/editor-common/insert';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { InputRuleWrapper } from '@atlaskit/editor-common/types';
import { createRule } from '@atlaskit/editor-common/utils';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import {
  createPlugin,
  leafNodeReplacementCharacter,
} from '@atlaskit/prosemirror-input-rules';

export const createHorizontalRule = (
  state: EditorState,
  start: number,
  end: number,
  inputMethod:
    | INPUT_METHOD.QUICK_INSERT
    | INPUT_METHOD.TOOLBAR
    | INPUT_METHOD.INSERT_MENU
    | INPUT_METHOD.FORMATTING
    | INPUT_METHOD.SHORTCUT,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) => {
  if (!state.selection.empty) {
    return null;
  }

  let tr: Transaction | null = null;
  const { rule } = state.schema.nodes;
  /**
   * This is a workaround to get rid of the typeahead text when using quick insert
   * Once we insert *nothing*, we get a new transaction, so we can use the new selection
   * without considering the extra text after the `/` command.
   **/
  tr = state.tr.replaceWith(start, end, Fragment.empty);

  tr = safeInsert(rule.createChecked(), tr.selection.from)(tr);

  if (!tr) {
    tr = state.tr.replaceRange(
      start,
      end,
      new Slice(Fragment.from(state.schema.nodes.rule.createChecked()), 0, 0),
    );
  }

  editorAnalyticsAPI?.attachAnalyticsEvent({
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.DIVIDER,
    attributes: { inputMethod },
    eventType: EVENT_TYPE.TRACK,
  })(tr);

  return tr;
};

const createHorizontalRuleAutoformat = (
  state: EditorState,
  start: number,
  end: number,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) => {
  const { listItem } = state.schema.nodes;

  if (hasParentNodeOfType(listItem)(state.selection)) {
    return null;
  }

  return createHorizontalRule(
    state,
    start,
    end,
    INPUT_METHOD.FORMATTING,
    editorAnalyticsAPI,
  );
};

export function inputRulePlugin(
  schema: Schema,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin | undefined {
  const rules: Array<InputRuleWrapper> = [];

  if (schema.nodes.rule) {
    // '---' and '***' for hr
    rules.push(
      createRule(/^(\-\-\-|\*\*\*)$/, (state, _match, start, end) =>
        createHorizontalRuleAutoformat(state, start, end, editorAnalyticsAPI),
      ),
    );

    // '---' and '***' after shift+enter for hr
    rules.push(
      createRule(
        new RegExp(`${leafNodeReplacementCharacter}(\\-\\-\\-|\\*\\*\\*)`),
        (state, _match, start, end) => {
          const { hardBreak } = state.schema.nodes;
          if (state.doc.resolve(start).nodeAfter!.type !== hardBreak) {
            return null;
          }
          return createHorizontalRuleAutoformat(
            state,
            start,
            end,
            editorAnalyticsAPI,
          );
        },
      ),
    );
  }

  if (rules.length !== 0) {
    return new SafePlugin(
      createPlugin('rule', rules, {
        isBlockNodeRule: true,
      }),
    );
  }

  return;
}

export default inputRulePlugin;
