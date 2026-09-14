import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

/**
 * Single source of truth for the consolidated container-in-panel experiment gate.
 *
 * `platform_editor_nest_container_in_panel` unlocks nesting expand, a nested panel, blockquote
 * and bodiedExtension inside `panel_c1`. It is a platform feature experiment (managed in
 * Statsig), not a legacy editor experiment, so it is read via `@atlaskit/platform-feature-experiments`.
 *
 * The in-production table-in-panel scenario is a separate, independently-rolled-out flag
 * (`platform_editor_nest_table_in_panel`) and is intentionally not covered here.
 */
export const isPanelNestingContainerExperimentEnabled = (): boolean =>
	isExperimentEnabled('platform_editor_nest_container_in_panel');
