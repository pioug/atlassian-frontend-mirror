import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../15-external-media-urls';

export const ExternalMediaUrls: WorkbenchExample<typeof Example> = wb(Example);
