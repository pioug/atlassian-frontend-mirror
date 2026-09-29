import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TimesExample from '../100-times';

export const Times: WorkbenchExample<typeof TimesExample> = wb(TimesExample);
