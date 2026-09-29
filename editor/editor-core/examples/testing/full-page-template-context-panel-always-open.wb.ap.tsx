import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-template-context-panel-always-open';

export const FullPageTemplateContextPanelAlwaysOpen: WorkbenchExample<typeof Example> = wb(Example);
