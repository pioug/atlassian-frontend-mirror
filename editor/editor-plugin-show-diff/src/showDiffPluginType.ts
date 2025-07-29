import type { StepJson } from '@atlaskit/editor-common/collab';
import type { NextEditorPlugin, EditorCommand } from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { Step } from '@atlaskit/editor-prosemirror/transform';

export type DiffParams = {
	/**
	 * Prosemirror steps. This is used to calculate and show the diff in the editor
	 */
	steps: StepJson[];
	originalDoc: JSONDocNode;
};

export type PMDiffParams = {
	/**
	 * Prosemirror steps. This is used to calculate and show the diff in the editor
	 */
	steps: Step[];
	originalDoc: Node;
};

export type ShowDiffPlugin = NextEditorPlugin<
	'showDiff',
	{
		pluginConfiguration: DiffParams | undefined;
		commands: {
			showDiff: (config: PMDiffParams) => EditorCommand;
			hideDiff: EditorCommand;
		};
	}
>;
