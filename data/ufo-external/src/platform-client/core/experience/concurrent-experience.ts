import { ufolog } from '../../../logger';

import { type AbstractExperienceConfig } from './abstract-experience';
import { UFOExperience } from './experience';

export class ConcurrentExperience {
	experienceId: string;
	config: AbstractExperienceConfig;
	instances: { [key: string]: UFOExperience } = {};

	constructor(experienceId: string, config: AbstractExperienceConfig) {
		this.experienceId = experienceId;
		this.config = config;
	}

	getInstance(instanceId: string): UFOExperience {
		if (!this.instances[instanceId]) {
			this.instances[instanceId] = new UFOExperience(this.experienceId, this.config, instanceId);
		}

		return this.instances[instanceId];
	}

	release(instanceId: string): void {
		ufolog('instanceId', instanceId);
		if (this.instances[instanceId]) {
			this.instances[instanceId].abort();
		}
		delete this.instances[instanceId];
	}
}
