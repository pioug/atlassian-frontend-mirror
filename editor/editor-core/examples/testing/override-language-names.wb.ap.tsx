import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../14-override-language-names';

export const OverrideLanguageNames: WorkbenchExample<typeof Example> = wb(Example);
