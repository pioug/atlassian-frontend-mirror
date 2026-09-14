import type { Schema } from '@atlaskit/editor-prosemirror/model';

import { isPanelNestingContainerExperimentEnabled } from './isPanelNestingContainerExperimentEnabled';

// The container children unlocked on panel_c1 by the consolidated
// `platform_editor_nest_container_in_panel` experiment. `table` is intentionally excluded:
// it ships independently under `platform_editor_nest_table_in_panel` and is checked by
// `isPanelNestingTableSupported`.
const PANEL_C1_CONTAINER_CHILD_TYPES = ['expand', 'panel', 'blockquote', 'bodiedExtension'];

/*
 * Returns true if the schema supports nesting a container node (expand, nested panel,
 * blockquote or bodiedExtension) inside a panel (panel_c1 variant), AND the consolidated
 * `platform_editor_nest_container_in_panel` experiment is enabled.
 *
 * ```typescript
 * const supportsContainerInPanel = isPanelNestingContainerSupported(state.schema);
 * ```
 */
export const isPanelNestingContainerSupported = (schema: Schema): boolean => {
	const { panel_c1 } = schema.nodes;

	if (!panel_c1) {
		return false;
	}

	// Confirm the PM schema actually allows at least one container child inside panel_c1.
	const panelC1CanContainAnyContainer = PANEL_C1_CONTAINER_CHILD_TYPES.some((type) => {
		const childType = schema.nodes[type];
		return !!childType && panel_c1.contentMatch.matchType(childType)?.validEnd === true;
	});

	return panelC1CanContainAnyContainer && isPanelNestingContainerExperimentEnabled();
};
