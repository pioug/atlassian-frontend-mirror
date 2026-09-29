import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../1-live-view-composable-editor';

export const LiveViewComposableEditor: WorkbenchExample<typeof Example> = wb(Example);
