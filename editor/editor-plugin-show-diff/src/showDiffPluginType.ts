import type { StepJson } from '@atlaskit/editor-common/collab';
import type { NextEditorPlugin, EditorCommand } from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { Step } from '@atlaskit/editor-prosemirror/transform';

export type DiffParams = {
	/**
	 * Color scheme to use for displaying diffs.
	 * 'standard' (default) uses purple for highlighting changes
	 * 'traditional' uses green for additions and red for deletions
	 */
	colourScheme?: 'standard' | 'traditional';
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

export type ACTION = 'SHOW_DIFF' | 'HIDE_DIFF' | 'SCROLL_TO_NEXT' | 'SCROLL_TO_PREVIOUS';

export type ShowDiffPlugin = NextEditorPlugin<
	'showDiff',
	{
		commands: {
			hideDiff: EditorCommand;
			scrollToNext: EditorCommand;
			scrollToPrevious: EditorCommand;
			showDiff: (config: PMDiffParams) => EditorCommand;
		};
		pluginConfiguration: DiffParams | undefined;
		sharedState: {
			/**
			 * The index of the current diff being viewed.
			 */
			activeIndex?: number;
			/**
			 * Whether the show diff feature is currently displaying changes.
			 * Defaults to false.
			 */
			isDisplayingChanges: boolean;
			/**
			 * The number of changes being displayed
			 */
			numberOfChanges?: number
		};
	}
>;
