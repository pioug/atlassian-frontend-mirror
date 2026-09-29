import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../11-extension-layout';

export const ExtensionLayout: WorkbenchExample<typeof Example> = wb(Example);
