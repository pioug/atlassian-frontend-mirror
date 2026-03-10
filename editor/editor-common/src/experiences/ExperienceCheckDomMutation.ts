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
	 * - subtree: extends observation to the entire subtree of nodes rooted at target
	 * - attributes: changes to attributes on the target node
	 * - attributeFilter: defines the specific attributes to monitor for changes
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe
	 */
	options?: Pick<MutationObserverInit, 'childList' | 'subtree' | 'attributes' | 'attributeFilter'>;

	/**
	 * Target element to observe for mutations
	 *
	 * If null or undefined, the experience will fail with  'domMutationTargetNotFound'.
	 */
	target?: Node | null;
};

export type ExperienceCheckDomMutationConfig = {
	/**
	 * Callback that returns one or more MutationObserver configurations.
	 *
	 * Can return:
	 * - A single config for one target to observe
	 * - An array of configs to observe multiple targets with one MutationObserver
	 * - null if no valid target is available (e.g., when selection node is not found)
	 *
	 * This is a callback to ensure consumers make explicit, conscious decisions about:
	 * - What elements to observe (performance: smaller scope = better performance)
	 * - What mutations to monitor (performance: fewer types = better performance)
	 *
	 * !!IMPORTANT!!
	 * Return null if the target element cannot be found.
	 * This will immediately fail the experience with experienceFailureReason 'domMutationTargetNotFound'.
	  */
	observeConfig: () => (ExperienceCheckDomMutationObserveConfig | ExperienceCheckDomMutationObserveConfig[] | null);

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
	private observeConfig: ExperienceCheckDomMutationConfig['observeConfig'];

	constructor({ onDomMutation, observeConfig }: ExperienceCheckDomMutationConfig) {
		this.onDomMutation = onDomMutation;
		this.observeConfig = observeConfig;
	}

	start(callback: ExperienceCheckCallback): void {
		this.stop();

		const configResult = this.observeConfig();
		const configs = Array.isArray(configResult) ? configResult : [configResult];
		const validConfigs = configs.filter(
			(config): config is ExperienceCheckDomMutationObserveConfig =>
				!!config?.target,
		);

		if (validConfigs.length === 0) {
			callback({
				status: 'failure',
				reason: EXPERIENCE_FAILURE_REASON.DOM_MUTATION_TARGET_NOT_FOUND,
			});
			return;
		}

		this.mutationObserver = new MutationObserver((mutations) => {
			try {
				const result = this.onDomMutation({ mutations });
				if (result) {
					callback(result);
				}
			} catch {
				callback({
					status: 'failure',
					reason: EXPERIENCE_FAILURE_REASON.DOM_MUTATION_CHECK_ERROR,
				});
			}
		});

		for (const config of validConfigs) {
			const { target, options } = config;
			if (target) {
				this.mutationObserver.observe(target, options ?? { childList: true });
			}
		}
	}

	stop(): void {
		if (this.mutationObserver) {
			this.mutationObserver.disconnect();
			this.mutationObserver = undefined;
		}
	}
}
