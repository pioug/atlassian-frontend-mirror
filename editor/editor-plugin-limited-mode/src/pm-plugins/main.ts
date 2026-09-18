import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { shouldEnableLimitedModeForDocument } from '@atlaskit/editor-common/should-enable-limited-mode';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { LimitedModePlugin, LimitedModePluginState } from '../limitedModePluginType';
import { limitedModePluginKey } from './plugin-key';
import { createLatchDetector } from './utils/latch-detector';
import type { LatchDetector } from './utils/latch-detector-types';
import { LatchPolicy } from './utils/latch-policy';

type EditorStateConfig = Parameters<typeof EditorState.create>[0];

/**
 * Meta shape used to latch limited mode at runtime. Dispatching this is the entire delivery
 * mechanism: the transaction flows through `SharedStateAPI.notifyListeners`, which diffs the plugin's
 * shared state and notifies every consumer. No plugin re-registration and no schema rebuild.
 */
type LimitedModeMeta = {
	latchPolicyBreached: true;
};

type NavigatorWithDeviceMemory = Navigator & {
	deviceMemory?: number;
};

/**
 * Hardware hints, reported with a latch so it can be correlated with device class.
 *
 * Telemetry only — the policy no longer takes the hardware into account when deciding, so this
 * exists to answer "which devices are latching" from the data rather than by assumption. Both hints
 * are optional (`deviceMemory` is Chromium-only) and are simply absent where unsupported.
 */
const getDeviceHints = (): { deviceMemoryGb?: number; hardwareConcurrency?: number } => {
	if (typeof navigator === 'undefined') {
		return {};
	}

	const { hardwareConcurrency, deviceMemory } = navigator as NavigatorWithDeviceMemory;

	return { hardwareConcurrency, deviceMemoryGb: deviceMemory };
};

/** Control-arm state: the document decision alone, exactly as before the experiment. */
const documentOnlyState = (doc: PMNode): LimitedModePluginState => {
	const documentSizeBreachesThreshold = shouldEnableLimitedModeForDocument(doc);

	return {
		documentSizeBreachesThreshold,
		latchPolicyBreached: false,
		enabled: documentSizeBreachesThreshold,
	};
};

/** Treatment-arm state: whatever the policy says, for both of its reasons. */
const policyState = (policy: LatchPolicy): LimitedModePluginState => ({
	documentSizeBreachesThreshold: policy.isDocumentBreached(),
	latchPolicyBreached: policy.isBreached(),
	enabled: policy.isBreached(),
});

export const createPlugin = (
	api?: ExtractInjectionAPI<LimitedModePlugin>,
	/**
	 * Replaces the policy this plugin would build for itself.
	 *
	 * Internal seam for tests that need to drive the criteria against a controlled clock and
	 * thresholds. Production goes through `limitedModePlugin`, which never passes one, so the
	 * experiment still decides whether a policy exists at all.
	 */
	injectedPolicy?: LatchPolicy,
): SafePlugin<LimitedModePluginState> => {
	let detector: LatchDetector | undefined;
	let policy: LatchPolicy | undefined;

	if (injectedPolicy) {
		policy = injectedPolicy;
	} else if (isExperimentEnabled('platform_editor_dynamic_limited_mode')) {
		const config = expVal('platform_editor_dynamic_limited_mode', 'policyConfig', {
			warmUpMs: 10_000,
			slowInputMs: 100,
			latencyWindowSize: 12,
			latencySlowSamplesRequired: 6,
			freezeTaskMs: 600,
			freezeTasksRequired: 3,
			freezeWindowMs: 30_000,
			requiredConfirmations: 2,
			confirmationGapMs: 30_000,
			bulkChangeNodeSize: 100,
			bulkChangeSuppressionMs: 2_000,
			docSizeThreshold: 750_000,
			nodeCountThreshold: 5_000,
		});

		// Resolved once per editor rather than per transaction. When off, no policy is built and the
		// document decision runs inline exactly as it did before this experiment.
		policy = new LatchPolicy({
			now: () => performance.now(),
			config,
		});
	}

	return new SafePlugin<LimitedModePluginState>({
		key: limitedModePluginKey,
		props: {
			handleTextInput() {
				detector?.measureInput();

				// Never handle the input — this is measurement only.
				return false;
			},
		},
		view: (editorView: EditorView) => {
			// No policy means the experiment is off: no observers, no per-keystroke measurement.
			if (!policy) {
				return {};
			}

			const startedAt = performance.now();

			detector = createLatchDetector({
				policy,
				onLatchCriteriaMet: (details) => {
					// Treatment arm only — the detector does not exist in control. See LimitedModeLatchedAEP.
					//
					// `details` is the policy's own snapshot of what it latched on, taken before it cleared
					// its evidence buffers, so it reports the closing window rather than an empty one.
					api?.analytics?.actions.fireAnalyticsEvent({
						action: ACTION.LIMITED_MODE_LATCHED,
						actionSubject: ACTION_SUBJECT.EDITOR,
						eventType: EVENT_TYPE.OPERATIONAL,
						attributes: {
							latched: true,
							reason: details.reason,
							firstWindowReason: details.firstWindowReason,
							requiredConfirmations: details.requiredConfirmations,
							documentAlreadyBreached: details.documentAlreadyBreached,
							msFromFirstWindow: details.msFromFirstWindow,
							latencyMedianMs: details.latencyMedianMs,
							totalInputSamples: details.totalInputSamples,
							totalSlowInputs: details.totalSlowInputs,
							totalFreezes: details.totalFreezes,
							nodeSize: editorView.state.doc.nodeSize,
							// Read at latch time rather than at construction: the hints are static, and this
							// keeps every device fact in one place next to the decision it is compared against.
							...getDeviceHints(),
							// Measured from the plugin view starting, which is a little later than the policy's
							// own `timeToLatchMs` (it starts at plugin construction).
							timeToLatch: performance.now() - startedAt,
						},
					});

					// The policy already holds the latch; this transaction only prompts the plugin to
					// re-read it, which is what notifies every consumer through shared state.
					editorView.dispatch(
						editorView.state.tr.setMeta(limitedModePluginKey, { latchPolicyBreached: true }),
					);
				},
			});

			return {
				destroy: () => {
					detector?.destroy();
					detector = undefined;
				},
			};
		},
		state: {
			init(_config: EditorStateConfig, editorState: EditorState) {
				if (!policy) {
					return documentOnlyState(editorState.doc);
				}

				policy.evaluateDocument(editorState.doc);

				return policyState(policy);
			},
			apply: (
				tr: ReadonlyTransaction,
				currentPluginState: LimitedModePluginState,
				oldState: EditorState,
				_newState: EditorState,
			) => {
				const documentReplaced = Boolean(tr.getMeta('replaceDocument'));

				if (!policy) {
					// Control arm, unchanged: skip the traversal once already breached, but always re-check
					// when the document is replaced (e.g. live-to-live page navigation).
					if (currentPluginState.documentSizeBreachesThreshold && !documentReplaced) {
						return currentPluginState;
					}

					return documentOnlyState(tr.doc);
				}

				// The detector's latch arrives as a transaction so that plugin state stays a function of
				// the transaction stream rather than of when `apply` happens to read the policy. Dev
				// tooling dispatches the same meta to force limited mode by hand.
				if (
					(tr.getMeta(limitedModePluginKey) as LimitedModeMeta | undefined)?.latchPolicyBreached
				) {
					policy.latch();
				}

				// Only on replacement, never on an ordinary edit: the check walks the whole document, so
				// running it per transaction is a full-document scan on every keystroke. The trade-off is
				// that a document editing its way past the thresholds is not noticed until it next loads.
				//
				// Deliberately not skipped when limited mode is already on. Replacement is the one moment
				// the document verdict can go *down* — live-to-live navigation onto a smaller page — so
				// skipping it there is what would strand limited mode on forever. It costs one walk per
				// page navigation, which is nothing next to the navigation itself.
				if (documentReplaced) {
					policy.evaluateDocument(tr.doc);
				}

				// Report bulk work so the policy can discount it. The policy decides what counts as bulk;
				// this only supplies the facts.
				//
				// Known gap: operations that are expensive but barely change document size — table
				// resize, drag-and-drop moves (delete + insert nets to ~0), type-ahead — are not
				// suppressed. `@atlaskit/insm` already tracks exactly these via `startHeavyTask`, but its
				// public facade does not expose `runningHeavyTasks`, so there is no way to read them from
				// here today. Closing that gap needs an accessor on the insm package.
				if (tr.docChanged) {
					detector?.noteDocumentChange({
						nodeSizeDelta: tr.doc.nodeSize - oldState.doc.nodeSize,
						isDocumentReplaced: documentReplaced,
					});
				}

				const next = policyState(policy);

				// Keep the previous object when nothing changed, so shared-state diffing stays cheap and
				// consumers are not notified for no reason.
				return next.enabled === currentPluginState.enabled &&
					next.documentSizeBreachesThreshold === currentPluginState.documentSizeBreachesThreshold
					? currentPluginState
					: next;
			},
		},
	});
};
