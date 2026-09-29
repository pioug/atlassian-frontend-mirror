import { wb, type WorkbenchExample } from '@atlassian/workbench';

import RadioSelectExample from '../02-radio-select';

export const RadioSelect: WorkbenchExample<typeof RadioSelectExample> = wb(RadioSelectExample);
