import { indentation } from '@atlaskit/adf-schema';
import { MAX_INDENTATION_LEVEL } from '@atlaskit/editor-common/indentation';

import { getIndentCommand, getOutdentCommand, isIndentationAllowed } from './editor-commands';
import type { IndentationPlugin } from './indentationPluginType';
import { keymapPlugin } from './pm-plugins/keymap';

export const indentationPlugin: IndentationPlugin = ({ api }) => ({
	name: 'indentation',

	marks() {
		return [{ name: 'indentation', mark: indentation }];
	},

	actions: {
		indentParagraphOrHeading: getIndentCommand(api?.analytics?.actions),
		outdentParagraphOrHeading: getOutdentCommand(api?.analytics?.actions),
	},

	getSharedState(editorState) {
		if (!editorState) {
			return undefined;
		}

		const {
			tr: { selection },
			schema: {
				marks: { indentation },
			},
		} = editorState;

		const node = selection.$from.node();
		const indentationMark = node.marks.find((mark) => mark.type === indentation);
		return {
			isIndentationAllowed: isIndentationAllowed(editorState.schema, node),
			indentDisabled: indentationMark?.attrs.level >= MAX_INDENTATION_LEVEL ?? false,
			outdentDisabled: !indentationMark,
		};
	},

	pmPlugins() {
		return [
			{
				name: 'indentationKeymap',
				plugin: () => keymapPlugin(api?.analytics?.actions),
			},
		];
	},
});
