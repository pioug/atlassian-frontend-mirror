import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../20-renderer-actions';

export const RendererActions: WorkbenchExample<typeof Example> = wb(Example);
