import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-with-media-caption-disabled';

export const FullPageWithMediaCaptionDisabled: WorkbenchExample<typeof Example> = wb(Example);
