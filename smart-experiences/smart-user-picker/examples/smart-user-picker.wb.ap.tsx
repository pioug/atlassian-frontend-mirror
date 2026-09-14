import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SmartUserPickerExample from './00-smart-user-picker';
import WithOptionFailoversExample from './01-with-option-failovers';
import WithDefaultLookupValuesExample from './02-with-default-lookup-values';
import WithStyleOverrideExample from './03-with-style-override';
import WithEmailSearchExample from './04-with-email-search';

export const SmartUserPicker: WorkbenchExample = wb(SmartUserPickerExample);
export const WithOptionFailovers: WorkbenchExample = wb(WithOptionFailoversExample);
export const WithDefaultLookupValues: WorkbenchExample = wb(WithDefaultLookupValuesExample);
export const WithStyleOverride: WorkbenchExample = wb(WithStyleOverrideExample);
export const WithEmailSearch: WorkbenchExample = wb(WithEmailSearchExample);
