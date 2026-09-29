import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../0-full-page-without-media-caption';

export const FullPageWithoutMediaCaption: WorkbenchExample<typeof Example> = wb(Example);
