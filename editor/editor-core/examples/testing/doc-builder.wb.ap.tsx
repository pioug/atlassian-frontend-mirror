import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../25-doc-builder';

export const DocBuilder: WorkbenchExample<typeof Example> = wb(Example);
