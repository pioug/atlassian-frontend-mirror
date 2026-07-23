import type { StepJson } from '@atlaskit/editor-common/collab';
import type {
	NextEditorPlugin,
	EditorCommand,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ExpandPlugin } from '@atlaskit/editor-plugin-expand';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { Step } from '@atlaskit/editor-prosemirror/transform';

import type { SmartDiffThresholds as SmartDiffThresholdsInternal } from './pm-plugins/calculateDiff/smart/thresholds';

export type ColorScheme = 'standard' | 'traditional';
export type DiffType = 'inline' | 'block' | 'step' | 'smart';

/**
 * Where node/paragraph-level deleted content is rendered relative to the new (replacement)
 * content in the `smart` diffType:
 * - `'top'` (default): the deleted content is anchored above the new content.
 * - `'bottom'`: the deleted content is anchored below the new content.
 */
export type DeletedDiffPlacement = 'top' | 'bottom';

/**
 * Where inline-level (and sentence-level) deleted content is rendered relative to the new
 * (replacement) content in the `smart` diffType. This is independent of the node/paragraph-level
 * `deletedDiffPlacement` option:
 * - `'before'` (default): the deleted content is anchored before the new content.
 * - `'after'`: the deleted content is anchored after the new content.
 */
export type InlineDeletedDiffPlacement = 'before' | 'after';

// Re-export the canonical `SmartDiffThresholds` declaration (single source of truth) so the
// public plugin types stay in sync with the smart-diff implementation.
export type SmartDiffThresholds = SmartDiffThresholdsInternal;

export type DiffDescriptor = {
	id: string;
	type: 'inline' | 'block' | 'widget';
};

export type DiffParams = {
	/**
	 * Color scheme to use for displaying diffs.
	 * 'standard' (default) uses purple for highlighting changes
	 * 'traditional' uses green for additions and red for deletions
	 */
	colorScheme?: ColorScheme;
	originalDoc: JSONDocNode;
	/**
	 * Prosemirror steps. This is used to calculate and show the diff in the editor
	 */
	steps: StepJson[];
};

export type PMDiffParams = {
	/**
	 * For the `smart` diffType, where node/paragraph-level deleted content is rendered relative to
	 * the new content. Defaults to `'top'`. Ignored for other diff types.
	 */
	deletedDiffPlacement?: DeletedDiffPlacement;
	diffType?: DiffType;
	/**
	 * When true, removes only the dark-purple underline (`border-bottom`) from added/updated
	 * (inserted) diff content, keeping the purple background highlight and all other styling.
	 * Only affects the extended (`smart`) styles. Defaults to `false`, and is a no-op unless the
	 * relevant gate is enabled.
	 */
	hideAddedDiffsUnderline?: boolean;
	hideDeletedDiffs?: boolean;
	/**
	 * For the `smart` diffType, where inline-level (and sentence-level) deleted content is rendered
	 * relative to the new content. Defaults to `'before'`. Independent of `deletedDiffPlacement`
	 * (which controls node/paragraph-level placement). Ignored for other diff types, and a no-op
	 * unless the relevant gate is enabled.
	 */
	inlineDeletedDiffPlacement?: InlineDeletedDiffPlacement;
	isInverted?: boolean;
	originalDoc: Node;
	/**
	 * When true, the editor will scroll to bring the first diff decoration into view
	 * after the diff is shown.
	 */
	scrollIntoView?: boolean;
	/**
	 * Whether to show indicators at the doc margin for the diffs.
	 */
	showIndicators?: boolean;
	/**
	 * Optional overrides for the `smart` diffType density thresholds. Ignored for other
	 * diff types. Partial — omitted fields fall back to defaults.
	 */
	smartThresholds?: Partial<SmartDiffThresholds>;
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
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<ExpandPlugin>,
			OptionalPlugin<UserIntentPlugin>,
		];
		pluginConfiguration: DiffParams | undefined;
		sharedState: {
			/**
			 * The index of the current diff being viewed.
			 */
			activeIndex?: number;
			/**
			 * The diff descriptors of the diff decorations currently being displayed.
			 * Only set when `platform_editor_diff_plugin_extended` is on.
			 */
			diffDescriptors?: DiffDescriptor[];
			/**
			 * Whether the show diff feature is currently displaying changes.
			 * Defaults to false.
			 */
			isDisplayingChanges: boolean;
			/**
			 * The number of changes being displayed
			 */
			numberOfChanges?: number;
			/**
			 * Whether to show indicators at the doc margin for the diffs.
			 */
			showIndicators?: boolean;
		};
	}
>;
