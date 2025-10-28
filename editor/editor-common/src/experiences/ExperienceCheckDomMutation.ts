import { EXPERIENCE_FAILURE_REASON } from './consts';
import type {
	ExperienceCheck,
	ExperienceCheckCallback,
	ExperienceCheckResult,
} from './ExperienceCheck';

export type ExperienceDomMutationCheckOptions = {
	mutations: MutationRecord[];
};

export type ExperienceCheckDomMutationObserveConfig = {
	/**
	 * MutationObserver options specifying what types of mutations to observe
	 *
	 * !!IMPORTANT!!
	 * For performance reasons, avoid observing more mutation types than necessary.
	 *
	 * We explicitly only support a subset of MutationObserverInit options that
	 * are relevant for most use cases and less likely to cause performance issues.
	 *
	 * These include:
	 * - childList: adding/removing child nodes directly under the target node
	 * - attributes: changes to attributes on the target node
	 * - attributeFilter: defines the specific attributes to monitor for changes
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe
	 */
	options?: Pick<MutationObserverInit, 'childList' | 'attributes' | 'attributeFilter'>;

	/**
	 * Target element to observe for mutations
	 *
	 * If null or undefined, the experience will fail with reason 'target-not-found'.
	 */
	target?: Node | null;
};

export type ExperienceCheckDomMutationConfig = {
	/**
	 * Callback that returns the MutationObserver configuration
	 *
	 * This is a callback to ensure consumers make explicit, conscious decisions about:
	 * - What element to observe (performance: smaller scope = better performance)
	 * - What mutations to monitor (performance: fewer types = better performance)
	 *
	 * !!IMPORTANT!!
	 * Return null if the target element cannot be found.
	 * This will immediately fail the experience with reason 'target-not-found'.
	 */
	observeConfig: () => ExperienceCheckDomMutationObserveConfig | null;

	/**
	 * Callback invoked when DOM mutations are detected
	 *
	 * Return a result to complete the experience, or undefined to continue observing
	 */
	onDomMutation: (options: ExperienceDomMutationCheckOptions) => ExperienceCheckResult | undefined;
};

/**
 * Check for the completion of an experience based on DOM mutations
 *
 * Uses a MutationObserver to monitor DOM changes and invokes the provided
 * callback when relevant mutations are detected.
 *
 * Will result in success or failure based on the outcome of the callback.
 */
export class ExperienceCheckDomMutation implements ExperienceCheck {
	private mutationObserver: MutationObserver | undefined;
	private onDomMutation: (
		options: ExperienceDomMutationCheckOptions,
	) => ExperienceCheckResult | undefined;
	private observeConfig: () => ExperienceCheckDomMutationObserveConfig | null;

	constructor({ onDomMutation, observeConfig }: ExperienceCheckDomMutationConfig) {
		this.onDomMutation = onDomMutation;
		this.observeConfig = observeConfig;
	}

	start(callback: ExperienceCheckCallback) {
		this.stop();

		const config = this.observeConfig();

		if (!config?.target) {
			callback({
				status: 'failure',
				metadata: {
					reason: EXPERIENCE_FAILURE_REASON.DOM_MUTATION_TARGET_NOT_FOUND,
				},
			});
			return;
		}

		this.mutationObserver = new MutationObserver((mutations) => {
			try {
				const result = this.onDomMutation({ mutations });
				if (result) {
					callback(result);
				}
			} catch (error) {
				callback({
					status: 'failure',
					metadata: {
						reason: EXPERIENCE_FAILURE_REASON.DOM_MUTATION_CHECK_ERROR,
					},
				});
			}
		});

		const { target, options } = config;
		this.mutationObserver.observe(target, options);
	}

	stop() {
		if (this.mutationObserver) {
			this.mutationObserver.disconnect();
			this.mutationObserver = undefined;
		}
	}
}
