import type { StepJson } from '@atlaskit/editor-common/collab';
import type { NextEditorPlugin, EditorCommand } from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { Step } from '@atlaskit/editor-prosemirror/transform';

export type DiffParams = {
	originalDoc: JSONDocNode;
	/**
	 * Prosemirror steps. This is used to calculate and show the diff in the editor
	 */
	steps: StepJson[];
};

export type PMDiffParams = {
	originalDoc: Node;
	/**
	 * Prosemirror steps. This is used to calculate and show the diff in the editor
	 */
	steps: Step[];
};

export type ACTION = 'SHOW_DIFF' | 'HIDE_DIFF';

export type ShowDiffPlugin = NextEditorPlugin<
	'showDiff',
	{
		commands: {
			hideDiff: EditorCommand;
			showDiff: (config: PMDiffParams) => EditorCommand;
		};
		pluginConfiguration: DiffParams | undefined;
		sharedState: {
			/**
			 * Whether the show diff feature is currently displaying changes.
			 * Defaults to false.
			 */
			isDisplayingChanges: boolean;
		};
	}
>;
