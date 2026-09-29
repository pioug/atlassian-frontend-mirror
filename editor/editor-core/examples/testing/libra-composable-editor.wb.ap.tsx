import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../99-libra-composable-editor';

export const LibraComposableEditor: WorkbenchExample<typeof Example> = wb(Example);
