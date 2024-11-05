import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { FeatureFlags, InputRuleWrapper } from '@atlaskit/editor-common/types';
import { createRule } from '@atlaskit/editor-common/utils';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { createPlugin, leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';

import { openTypeAheadAtCursor } from '../pm-plugins/commands/open-typeahead-at-cursor';
import type { TypeAheadHandler } from '../types';

export function inputRulePlugin(
	schema: Schema,
	typeAheads: TypeAheadHandler[],
	featureFlags: FeatureFlags,
): SafePlugin | undefined {
	if (!typeAheads || typeAheads.length === 0) {
		return;
	}
	const rules = typeAheads.reduce<InputRuleWrapper[]>((acc, typeAhead) => {
		const trigger = typeAhead.customRegex || typeAhead.trigger;
		if (!trigger) {
			return acc;
		}

		const regex = new RegExp(`(^|[.!?\\s${leafNodeReplacementCharacter}])(${trigger})$`);

		acc.push(
			createRule(regex, (state, match) => {
				return openTypeAheadAtCursor({
					triggerHandler: typeAhead,
					inputMethod: INPUT_METHOD.KEYBOARD,
				})({ tr: state.tr });
			}),
		);

		return acc;
	}, []);

	const plugin = new SafePlugin(
		createPlugin('type-ahead', rules, {
			allowInsertTextOnDocument: false,
		}),
	);

	return plugin;
}

export default inputRulePlugin;
