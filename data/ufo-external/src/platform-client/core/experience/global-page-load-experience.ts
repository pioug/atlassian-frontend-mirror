import { type PageLoadExperienceData } from '../../../types';
import { untilAll } from '../../utils/until-helpers';

import {
	type AbstractExperienceConfig,
	perfNowOrTimestamp,
	UFOAbstractExperience,
} from './abstract-experience';
import { ExperiencePerformanceTypes, ExperienceTypes } from './experience-types';
import { PageSegmentExperienceTypes } from './page-segment-experience-types';

class UFOGlobalPageLoadExperience extends UFOAbstractExperience {
	loadingPageLoadId: string = 'UNKNOWN';

	type: ExperienceTypes = ExperienceTypes.Load;
	performanceType: ExperiencePerformanceTypes = ExperiencePerformanceTypes.PageLoad;

	initial = true;

	startPageLoad(id: string, initial: boolean = false, startTime?: number): Promise<void> {
		const result = super.start(initial ? 0 : perfNowOrTimestamp(startTime));
		this.setPageLoadId(id);
		this.initial = initial;
		return result;
	}

	updateConfig(config: Partial<AbstractExperienceConfig>): void {
		Object.assign(this.config, config);
	}

	setPageLoadId(id: string): void {
		this.loadingPageLoadId = id;
	}

	async getId(): Promise<string> {
		return this.loadingPageLoadId;
	}

	async exportData(): Promise<PageLoadExperienceData> {
		const data = await super.exportData();
		return {
			...data,
			initial: this.initial,
		};
	}
}

export const GlobalPageLoadExperience: UFOGlobalPageLoadExperience =
	new UFOGlobalPageLoadExperience('UFO_GLOBAL_PAGE_LOAD', {
		type: ExperienceTypes.Load,
		performanceType: ExperiencePerformanceTypes.PageLoad,
		// this should come from global config
		until: untilAll([{ category: PageSegmentExperienceTypes.PRODUCT }]),
	});
