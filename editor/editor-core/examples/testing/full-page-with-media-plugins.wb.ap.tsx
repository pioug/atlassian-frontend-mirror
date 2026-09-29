import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-with-media-plugins';

export const FullPageWithMediaPlugins: WorkbenchExample<typeof Example> = wb(Example);
