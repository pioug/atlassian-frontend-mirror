import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

import { createRule, createPlugin } from '../../../utils/input-rules';
import { leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';
import { TypeAheadHandler } from '../types';
import type { FeatureFlags } from '../../../types/feature-flags';

import { pluginKey as typeAheadPluginKey, TypeAheadPluginState } from './main';

// We cannot set a proper plugin key on input rule plugins, so instead, once
// the plugin is created we save its key to this variable
export let typeAheadInputRulesPluginKey = '';

export function inputRulePlugin(
  schema: Schema,
  typeAheads: TypeAheadHandler[],
  featureFlags: FeatureFlags,
): Plugin | undefined {
  const triggersRegex = typeAheads
    .map((t) => t.customRegex || t.trigger)
    .join('|');

  if (!triggersRegex.length) {
    return;
  }

  const regex = new RegExp(
    `(^|[.!?\\s${leafNodeReplacementCharacter}])(${triggersRegex})$`,
  );

  const typeAheadInputRule = createRule(regex, (state, match) => {
    const typeAheadState = typeAheadPluginKey.getState(
      state,
    ) as TypeAheadPluginState;

    /**
     * Why using match 2 and 3?  Regex:
     * (allowed characters before trigger)(joined|triggers|(sub capture groups))
     *            match[1]                     match[2]          match[3] – optional
     */
    const trigger = match[3] || match[2];

    if (!typeAheadState.isAllowed || !trigger) {
      return null;
    }

    const mark = schema.mark('typeAheadQuery', { trigger });
    const { tr, selection } = state;
    const marks = selection.$from.marks();

    return tr.replaceSelectionWith(
      schema.text(trigger, [mark, ...marks]),
      false,
    );
  });

  const plugin = createPlugin('type-ahead', [typeAheadInputRule], {
    allowInsertTextOnDocument: false,
    useUnpredictableInputRule: featureFlags.useUnpredictableInputRule,
  });
  typeAheadInputRulesPluginKey = (plugin as any).key;

  return plugin;
}

export default inputRulePlugin;
