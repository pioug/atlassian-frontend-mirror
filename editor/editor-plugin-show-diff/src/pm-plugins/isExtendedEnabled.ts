import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { DiffType } from '../showDiffPluginType';

/**
 * The "extended" diff pipeline is normally gated by `platform_editor_diff_plugin_extended`.
 * The `smart` diff type REQUIRES the extended pipeline, so whenever `smart` is active (and its
 * own gate `platform_editor_ai_smart_diff` is on) the extended pipeline is force-enabled,
 * independent of the extended gate. For all other diff types the extended gate alone decides.
 *
 * Pass the active `diffType` so callers deep in the decoration layer render the extended shape
 * when `smart` is active even if `platform_editor_diff_plugin_extended` is off.
 */
export const isExtendedEnabled = (diffType?: DiffType): boolean =>
	expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) ||
	(diffType === 'smart' && fg('platform_editor_ai_smart_diff'));
