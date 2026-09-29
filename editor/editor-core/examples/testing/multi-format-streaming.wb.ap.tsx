import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../99-multi-format-streaming';

export const MultiFormatStreaming: WorkbenchExample<typeof Example> = wb(Example);
