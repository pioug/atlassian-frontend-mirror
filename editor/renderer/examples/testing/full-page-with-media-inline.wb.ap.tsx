import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../0-full-page-with-media-inline';

export const FullPageWithMediaInline: WorkbenchExample<typeof Example> = wb(Example);
