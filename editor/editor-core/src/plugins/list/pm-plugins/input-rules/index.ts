import { InputRuleWrapper } from '@atlaskit/prosemirror-input-rules';
import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createPlugin } from '../../../../utils/input-rules';
import { createRuleForListType } from './create-list-input-rule';
import { FeatureFlags } from '../../../../types/feature-flags';

export default function inputRulePlugin(
  schema: Schema,
  featureFlags: FeatureFlags,
): SafePlugin | undefined {
  const {
    nodes: { bulletList, orderedList },
  } = schema;
  const rules: InputRuleWrapper[] = [];

  if (bulletList) {
    rules.push(
      createRuleForListType({
        // Using UTF instead of • character
        // because of issue where product converted the
        // character into an escaped version.
        expression: /^\s*([\*\-\u2022]) $/,
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
    return createPlugin('lists', rules);
  }

  return;
}
