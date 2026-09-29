import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../31-adf-viewer-DAC';

export const AdfViewerDAC: WorkbenchExample<typeof Example> = wb(Example);
