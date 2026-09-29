import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../0-full-page-with-i18n';

export const FullPageWithI18n: WorkbenchExample<typeof Example> = wb(Example);
