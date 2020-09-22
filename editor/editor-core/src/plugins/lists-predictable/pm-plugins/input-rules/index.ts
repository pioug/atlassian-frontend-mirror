import { InputRule } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { instrumentedInputRule } from '../../../../utils/input-rules';
import { createRuleForListType } from './create-list-input-rule';

export default function inputRulePlugin(schema: Schema): Plugin | undefined {
  const {
    nodes: { bulletList, orderedList },
  } = schema;
  const rules: InputRule[] = [];

  if (bulletList) {
    rules.push(
      createRuleForListType({
        expression: /^\s*([\*\-]) $/,
        listType: bulletList,
      }),
    );
  }

  if (orderedList) {
    rules.push(
      createRuleForListType({
        expression: /^(1)[\.\)] $/,
        listType: orderedList,
      }),
    );
  }

  if (rules.length !== 0) {
    return instrumentedInputRule('lists', { rules });
  }

  return;
}
