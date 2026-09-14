import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CustomColorsExample from './00-custom-colors';
import DateWithClickExample from './01-date-with-click';
import CustomFormatExample from './02-custom-format';

export const CustomColors: WorkbenchExample = wb(CustomColorsExample);
export const DateWithClick: WorkbenchExample = wb(DateWithClickExample);
export const CustomFormat: WorkbenchExample = wb(CustomFormatExample);
