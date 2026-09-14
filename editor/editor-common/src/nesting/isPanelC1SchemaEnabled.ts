import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { isPanelNestingContainerExperimentEnabled } from './isPanelNestingContainerExperimentEnabled';

/*
 * Returns true when any panel container-variant nesting experiment is enabled, i.e. when the
 * `panel_c1` node should exist in the schema and be handled by the panel plugin/renderer.
 *
 * `panel_c1` is a single shared node whose content depends on which scenario is enabled:
 * - the in-production table scenario is gated by `platform_editor_nest_table_in_panel`
 *   (registered in the legacy editor experiments config), and
 * - the consolidated expand / nested panel / blockquote / bodiedExtension scenario ships behind
 *   `platform_editor_nest_container_in_panel` (a platform feature experiment).
 * Registration, node views, click handlers and insertion logic are common to the node, so they
 * should be active when EITHER experiment is on. The concrete content model (table-only vs the
 * full container set) is selected per experiment where the node spec is built.
 *
 * ```typescript
 * if (isPanelC1SchemaEnabled()) {
 *   // register / handle panel_c1
 * }
 * ```
 */
export const isPanelC1SchemaEnabled = (): boolean =>
	expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true) ||
	isPanelNestingContainerExperimentEnabled();
