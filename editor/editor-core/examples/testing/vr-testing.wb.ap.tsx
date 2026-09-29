import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../99-vr-testing';

export const VrTesting: WorkbenchExample<typeof Example> = wb(Example);
