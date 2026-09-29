import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../0-full-page-with-ugc-scrubber';

export const FullPageWithUgcScrubber: WorkbenchExample<typeof Example> = wb(Example);
