import {
	ExperiencePerformanceTypes,
	ExperienceTypes,
	UFOExperience,
	UFOExperienceState,
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

type ExperienceFailureOptions = {
	reason?: string;
};

export class Experience {
	private readonly id: string;
	private readonly options: ExperienceOptions;

	private _ufoExperience: UFOExperience | undefined;
	private check: ExperienceCheck;

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
			if (result.status === 'success') {
				this.success();
			} else {
				this.failure({ reason: result.reason });
			}
		});
	}

	private stopCheck() {
		this.check.stop();
	}

	private isInProgress(): boolean {
		return PROGRESS_STATES.includes(this.ufoExperience.state.id);
	}

	/**
	 * Starts UFO experience tracking and starts all checks which monitor for completion of the experience.
	 */
	start() {
		this.ufoExperience.start();

		if (this.isInProgress()) {
			this.startCheck();
		}
	}

	/**
	 * Manually mark the experience as successful and stop any ongoing checks.
	 */
	success() {
		this.stopCheck();
		this.ufoExperience.success();
	}

	/**
	 * Manually abort the experience and stop any ongoing checks.
	 *
	 * Typically used when the experience did not complete due to user action and should not be marked as success or failure,
	 * for example on unmount or when navigating away from a page.
	 */
	abort() {
		this.stopCheck();
		this.ufoExperience.abort();
	}

	/**
	 * Manually mark the experience as failed and stop any ongoing checks.
	 */
	failure({ reason = 'error' }: ExperienceFailureOptions = {}) {
		this.stopCheck();
		this.ufoExperience.failure({ metadata: { reason } });
	}
}
