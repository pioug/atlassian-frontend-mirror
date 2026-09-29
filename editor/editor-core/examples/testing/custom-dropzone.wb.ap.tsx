import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../11-custom-dropzone';

export const CustomDropzone: WorkbenchExample<typeof Example> = wb(Example);
