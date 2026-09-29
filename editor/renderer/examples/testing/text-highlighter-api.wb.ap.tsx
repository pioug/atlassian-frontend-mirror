import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../24-text-highlighter-api';

export const TextHighlighterApi: WorkbenchExample<typeof Example> = wb(Example);
