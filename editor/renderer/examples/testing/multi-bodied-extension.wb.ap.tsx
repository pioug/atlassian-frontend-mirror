import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../0-multi-bodied-extension';

export const MultiBodiedExtension: WorkbenchExample<typeof Example> = wb(Example);
