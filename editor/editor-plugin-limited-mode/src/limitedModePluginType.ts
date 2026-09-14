import type React from 'react';

import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';

export type LimitedModePluginState = {
	/**
	 * The document itself breaches the size / node-count / legacy-content thresholds.
	 *
	 * Recomputed from the document, and deliberately re-evaluated when the document is replaced
	 * (live-to-live page navigation), so navigating from a huge page to a small one restores the full
	 * feature set.
	 */
	documentSizeBreachesThreshold: boolean;
	/**
	 * Whether limited mode is in force — the single flag every consumer should branch on.
	 *
	 * Derived from the reasons below and kept in state deliberately, so that consumers do not have to
	 * know what the reasons are or how they combine. Adding a future reason then needs no change
	 * outside this plugin.
	 */
	enabled: boolean;
	/**
	 * The latch policy says limited mode should be on.
	 *
	 * Only meaningful under `platform_editor_dynamic_limited_mode`; `false` in the control arm, where
	 * `documentSizeBreachesThreshold` alone decides. When the experiment is on this is the verdict
	 * `enabled` is taken from, and it covers both of the policy's reasons — the document thresholds
	 * and the runtime device criteria.
	 *
	 * The device half is **one-way**: once the runtime bar is met it is never cleared for the lifetime
	 * of the editor view, including across document replacement, because navigating between pages does
	 * not change the device. That is deliberate — entering or leaving limited mode is itself expensive
	 * (tearing down observers, rebuilding decoration sets), so a recoverable mode would risk
	 * oscillating on borderline devices and being worse than either steady state. A user whose machine
	 * recovers gets the full editor back by reloading the page.
	 */
	latchPolicyBreached: boolean;
};

export type LimitedModePlugin = NextEditorPlugin<
	'limitedMode',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		pluginConfiguration: LimitedModePluginOptions | undefined;
		sharedState: {
			enabled: boolean;
			limitedModePluginKey: PluginKey<LimitedModePluginState>;
		};
	}
>;

export type LimitedModePluginOptions = {
	contentId?: string;
	killSwitchEnabled?: boolean;
	showFlag?: (props: { close: string; description: React.ReactNode; title: string }) => void;
};
