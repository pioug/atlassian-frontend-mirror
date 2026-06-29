import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { InputRuleWrapper } from '@atlaskit/editor-common/types';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { createPlugin } from '@atlaskit/prosemirror-input-rules';

import { createRuleForListType } from './create-list-input-rule';

// Using UTF instead of • character
// because of issue where product converted the
// character into an escaped version.
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const BULLET_LIST_EXPRESSION = /^\s*([\*\-\u2022]) $/;

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const ORDERED_LIST_EXPRESSION = /((^[1-9]{1}[0-9]{0,2})|^(0))[\.\)] $/;

export default function inputRulePlugin(
	schema: Schema,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): SafePlugin | undefined {
	const {
		nodes: { bulletList, orderedList },
	} = schema;
	const rules: InputRuleWrapper[] = [];

	if (bulletList) {
		rules.push(
			createRuleForListType({
				expression: BULLET_LIST_EXPRESSION,
				listType: bulletList,
				editorAnalyticsApi,
			}),
		);
	}

	if (orderedList) {
		rules.push(
			createRuleForListType({
				expression: ORDERED_LIST_EXPRESSION,
				listType: orderedList,
				editorAnalyticsApi,
			}),
		);
	}

	if (rules.length !== 0) {
		return new SafePlugin(createPlugin('lists', rules));
	}

	return;
}
