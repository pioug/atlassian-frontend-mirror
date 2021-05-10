import { InputRuleWrapper } from '@atlaskit/prosemirror-input-rules';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { createPlugin } from '../../../../utils/input-rules';
import { createRuleForListType } from './create-list-input-rule';
import { FeatureFlags } from '../../../../types/feature-flags';

export default function inputRulePlugin(
  schema: Schema,
  featureFlags: FeatureFlags,
): Plugin | undefined {
  const {
    nodes: { bulletList, orderedList },
  } = schema;
  const rules: InputRuleWrapper[] = [];

  if (bulletList) {
    rules.push(
      createRuleForListType({
        expression: /^\s*([\*\-\•]) $/,
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
    return createPlugin('lists', rules, {
      useUnpredictableInputRule: featureFlags.useUnpredictableInputRule,
    });
  }

  return;
}
