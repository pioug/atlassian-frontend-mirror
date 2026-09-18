import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { getLimitedModeThresholds } from './limited-mode-document-thresholds';
import type { LimitedModeThresholds } from './limited-mode-document-thresholds';

const LEGACY_CONTENT_EXTENSION_KEY = 'legacy-content';

/**
 * Single source of truth for the limited (performance) mode decision.
 *
 * Shared by the limited-mode plugin (`editor-plugin-limited-mode/src/pm-plugins/main.ts`) and the
 * node-anchor provider (`node-anchor-provider.ts`) so the logic can no longer drift between two
 * hand-synced copies. It lives in `editor-common` to avoid a circular dependency (the plugin already
 * depends on `editor-common`; `editor-common` must not depend on the plugin).
 *
 * Limited mode is enabled when ANY of the following is true:
 * 1. `doc.nodeSize` exceeds the doc-size threshold (checked first, O(1))
 * 2. the document contains a legacy-content macro (LCM)
 * 3. node count exceeds the node-count threshold
 *
 * Thresholds default to `getLimitedModeThresholds()` but can be passed in, which is how the
 * limited-mode plugin's latch policy supplies them from its own config. See
 * `limited-mode-document-thresholds.ts` for the values and the data behind them.
 *
 * Performance: doc size is checked first so an oversized document skips the traversal entirely.
 */
export const shouldEnableLimitedModeForDocument = (
	doc: PMNode,
	thresholds: LimitedModeThresholds = getLimitedModeThresholds(),
): boolean => {
	const { docSizeThreshold, nodeCountThreshold } = thresholds;

	if (doc.nodeSize > docSizeThreshold) {
		return true;
	}

	// Single traversal for node count and LCM detection.
	let nodeCount = 0;
	let hasLcm = false;

	doc.descendants((node: PMNode) => {
		nodeCount += 1;

		if (node.attrs?.extensionKey === LEGACY_CONTENT_EXTENSION_KEY) {
			hasLcm = true;

			// Early exit: LCM found — limited mode will be enabled
			return false;
		}

		return true;
	});

	return hasLcm || nodeCount > nodeCountThreshold;
};
