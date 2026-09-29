import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../99-libra-confluence-full-page-editor';

export const LibraConfluenceFullPageEditor: WorkbenchExample<typeof Example> = wb(Example);
