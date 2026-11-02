import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { RuleNodeView } from '../node-views/RuleNodeView';

const selectRuleOnClick = createSelectionClickHandler(
	['rule'],
	(target) => !!target.closest('[data-rule-node-view]'),
	{ useLongPressSelection: false },
);

export const createPlugin = (): SafePlugin =>
	new SafePlugin({
		props: {
			nodeViews: {
				rule: (node: PMNode, view: EditorView) => new RuleNodeView(node, view),
			},
			handleClickOn(view, ...args) {
				const handled = selectRuleOnClick(view, ...args);
				if (handled && view.editable) {
					view.focus();
				}
				return handled;
			},
		},
	});

export default createPlugin;
