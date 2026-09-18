import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as BasicExample } from './1-basic';
import { default as FullPageExample } from './1-full-page';
import { default as AdvancedExample } from './2-advanced';
import { default as SmartExample } from './3-smart';
import { default as CustomScenariosExample } from './4-custom-scenarios';

export const Basic: WorkbenchExample = wb(BasicExample);
export const FullPage: WorkbenchExample = wb(FullPageExample);
export const Advanced: WorkbenchExample = wb(AdvancedExample);
export const Smart: WorkbenchExample = wb(SmartExample);
export const CustomScenarios: WorkbenchExample = wb(CustomScenariosExample);
