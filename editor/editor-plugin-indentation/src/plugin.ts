import { indentation } from '@atlaskit/adf-schema';
import { MAX_INDENTATION_LEVEL } from '@atlaskit/editor-common/indentation';
import type { Command, NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import { getIndentCommand, getOutdentCommand, isIndentationAllowed } from './commands';
import type { IndentationInputMethod } from './commands/utils';
import { keymapPlugin } from './pm-plugins/keymap';

type IndentationPluginSharedState = {
	isIndentationAllowed: boolean;
	indentDisabled: boolean;
	outdentDisabled: boolean;
};

export type IndentationPlugin = NextEditorPlugin<
	'indentation',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		actions: {
			indentParagraphOrHeading: (inputMethod: IndentationInputMethod) => Command;
			outdentParagraphOrHeading: (inputMethod: IndentationInputMethod) => Command;
		};
		sharedState: IndentationPluginSharedState | undefined;
	}
>;

const indentationPlugin: IndentationPlugin = ({ api }) => ({
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

export default indentationPlugin;
