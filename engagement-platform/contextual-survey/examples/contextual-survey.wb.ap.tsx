import { wb, type WorkbenchExample } from '@atlassian/workbench';

import UsageExample from './00-usage';
import NewSurveyUsageExample from './01-new-survey-usage';

export const Usage: WorkbenchExample = wb(UsageExample);
export const NewSurveyUsage: WorkbenchExample = wb(NewSurveyUsageExample);
