import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../7-dac-viewer';

export const DacViewer: WorkbenchExample<typeof Example> = wb(Example);
