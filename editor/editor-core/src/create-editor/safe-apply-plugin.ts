import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	EditorState,
	ReadonlyTransaction,
	SafePluginSpec,
} from '@atlaskit/editor-prosemirror/state';

import { freezeUnsafeTransactionProperties } from '../utils/performance/safer-transactions';

type SafeApplyPluginOptions = {
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
};

/**
 * This is for safety in case someone is trying to mutate
 * the transaction in the apply which should never be done.
 */
export class SafeApplyPlugin<PluginState> extends SafePlugin<PluginState> {
	constructor(spec: SafePluginSpec, options: SafeApplyPluginOptions = {}) {
		const { dispatchAnalyticsEvent } = options;

		if (spec.state) {
			const originalApply = spec.state.apply.bind(spec.state);

			spec.state.apply = (
				aTr: ReadonlyTransaction,
				value: PluginState,
				oldState: EditorState,
				newState: EditorState,
			) => {
				const self = this as SafePluginSpec;
				const pluginKey = self?.key;
				const tr = new Proxy(
					aTr,
					freezeUnsafeTransactionProperties<ReadonlyTransaction>({
						dispatchAnalyticsEvent,
						pluginKey: typeof pluginKey === 'string' ? pluginKey : undefined,
					}),
				);
				return originalApply(tr, value, oldState, newState);
			};
		}

		super(spec);
	}

	public static fromPlugin<T>(
		plugin: SafePlugin<T>,
		options: SafeApplyPluginOptions,
	): SafeApplyPlugin<T> {
		return new SafeApplyPlugin(plugin.spec as SafePluginSpec, options);
	}
}
