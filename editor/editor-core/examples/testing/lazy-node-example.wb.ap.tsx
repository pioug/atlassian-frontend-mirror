import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../1-lazy-node-example';

export const LazyNodeExample: WorkbenchExample<typeof Example> = wb(Example);
