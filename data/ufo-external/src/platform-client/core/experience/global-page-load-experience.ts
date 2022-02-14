import { PageLoadExperienceData } from '../../../types';
import { untilAll } from '../../utils/until-helpers';

import {
  AbstractExperienceConfig,
  perfNowOrTimestamp,
  UFOAbstractExperience,
} from './abstract-experience';
import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
} from './experience-types';
import { PageSegmentExperienceTypes } from './page-segment-experience-types';

class UFOGlobalPageLoadExperience extends UFOAbstractExperience {
  loadingPageLoadId: string = 'UNKNOWN';

  type = ExperienceTypes.Load;
  performanceType = ExperiencePerformanceTypes.PageLoad;

  initial = true;

  startPageLoad(id: string, initial: boolean = false, startTime?: number) {
    const result = super.start(initial ? 0 : perfNowOrTimestamp(startTime));
    this.setPageLoadId(id);
    this.initial = initial;
    return result;
  }

  updateConfig(config: AbstractExperienceConfig) {
    Object.assign(this.config, config);
  }

  setPageLoadId(id: string) {
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

export const GlobalPageLoadExperience = new UFOGlobalPageLoadExperience(
  'UFO_GLOBAL_PAGE_LOAD',
  {
    type: ExperienceTypes.Load,
    performanceType: ExperiencePerformanceTypes.PageLoad,
    // this should come from global config
    until: untilAll([{ category: PageSegmentExperienceTypes.PRODUCT }]),
  },
);
