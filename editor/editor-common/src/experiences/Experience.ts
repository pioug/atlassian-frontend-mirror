import {
	ExperiencePerformanceTypes,
	ExperienceTypes,
	UFOExperience,
	UFOExperienceState,
	type CustomData,
} from '@atlaskit/ufo';

import type { ExperienceCheck } from './ExperienceCheck';
import { ExperienceCheckComposite } from './ExperienceCheckComposite';

const PROGRESS_STATES = [UFOExperienceState.STARTED.id, UFOExperienceState.IN_PROGRESS.id];

type ExperienceOptions = {
	/**
	 * Checks used to determine experience completion, either success, or failure.
	 */
	checks?: ExperienceCheck[];
};

type ExperienceStartOptions = {
	metadata?: CustomData;
};

type ExperienceEndOptions = {
	metadata?: CustomData;
};

export class Experience {
	private readonly id: string;
	private readonly options: ExperienceOptions;

	private _ufoExperience: UFOExperience | undefined;
	private check: ExperienceCheck;
	private startOptions: ExperienceStartOptions | undefined;

	constructor(id: string, options: ExperienceOptions = {}) {
		this.id = id;
		this.options = options;

		this.check = new ExperienceCheckComposite(this.options.checks || []);
	}

	private get ufoExperience(): UFOExperience {
		if (!this._ufoExperience) {
			this._ufoExperience = new UFOExperience(this.id, {
				type: ExperienceTypes.Experience,
				performanceType: ExperiencePerformanceTypes.InlineResult,
				platform: { component: 'editor' },
			});
		}
		return this._ufoExperience;
	}

	private startCheck() {
		this.stopCheck();

		this.check.start((result) => {
			const { metadata } = result;
			if (result.status === 'success') {
				this.success({ metadata });
			} else if (result.status === 'abort') {
				this.abort({ metadata });
			} else if (result.status === 'failure') {
				this.failure({ metadata });
			}
		});
	}

	private stopCheck() {
		this.check.stop();
	}

	private isInProgress(): boolean {
		return PROGRESS_STATES.includes(this.ufoExperience.state.id);
	}

	private getEndStateConfig(options?: ExperienceEndOptions) {
		return {
			metadata:
				options?.metadata || this.startOptions?.metadata
					? {
							...this.startOptions?.metadata,
							...options?.metadata,
						}
					: undefined,
		};
	}

	/**
	 * Starts tracking the experience and all checks which monitor for completion.
	 *
	 * If the experience is already in progress, this will restart the checks.
	 * Metadata from options will be merged with any end state metadata.
	 *
	 * @param options - Configuration for starting the experience
	 * @param options.metadata - Optional metadata attached to all subsequent events for this started experience
	 */
	start(options?: ExperienceStartOptions) {
		this.startOptions = options?.metadata;
		this.ufoExperience.start();

		if (this.isInProgress()) {
			this.startCheck();
		}
	}

	/**
	 * Marks the experience as successful and stops any ongoing checks.
	 *
	 * Use this when the experience completes as expected.
	 *
	 * @param options - Configuration for the success event
	 * @param options.metadata - Optional metadata attached to the success event
	 */
	success(options?: ExperienceEndOptions) {
		this.stopCheck();
		this.ufoExperience.success(this.getEndStateConfig(options));
		this.startOptions = undefined;
	}

	/**
	 * Aborts the experience and stops any ongoing checks.
	 *
	 * Use this when a started experience terminates early due to user action or context change
	 * (e.g., component unmount, navigation). This is neither success nor failure.
	 *
	 * @param options - Configuration for the abort event
	 * @param options.metadata - Optional metadata attached to the abort event
	 *
	 * @example
	 * // Abort on component unmount
	 * useEffect(() => {
	 *   return () => experience.abort({ metadata: { reason: 'unmount' } });
	 * }, []);
	 */
	abort(options?: ExperienceEndOptions) {
		this.stopCheck();
		this.ufoExperience.abort(this.getEndStateConfig(options));
		this.startOptions = undefined;
	}

	/**
	 * Manually marks the experience as failed and stops any ongoing checks.
	 *
	 * Use this for actual failures in the experience flow (e.g., timeout, error conditions).
	 *
	 * @param options - Configuration for the failure event
	 * @param options.metadata - Optional metadata attached to the failure event
	 */
	failure(options?: ExperienceEndOptions) {
		this.stopCheck();
		this.ufoExperience.failure(this.getEndStateConfig(options));
		this.startOptions = undefined;
	}
}
