import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../0-full-page-with-fixed-size-media';

export const FullPageWithFixedSizeMedia: WorkbenchExample<typeof Example> = wb(Example);
