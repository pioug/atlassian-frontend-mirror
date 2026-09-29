import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../0-full-page-with-media-caption';

export const FullPageWithMediaCaption: WorkbenchExample<typeof Example> = wb(Example);
