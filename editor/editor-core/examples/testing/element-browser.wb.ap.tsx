import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../29-element-browser';

export const ElementBrowser: WorkbenchExample<typeof Example> = wb(Example);
