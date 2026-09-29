import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../101-media-ssr';

export const MediaSsr: WorkbenchExample<typeof Example> = wb(Example);
