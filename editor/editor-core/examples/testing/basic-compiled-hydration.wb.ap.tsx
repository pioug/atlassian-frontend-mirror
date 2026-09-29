import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../40-basic-compiled-hydration';

export const BasicCompiledHydration: WorkbenchExample<typeof Example> = wb(Example);
