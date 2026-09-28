import { wb, type WorkbenchExample } from '@atlassian/workbench';

import IconExamplesExample from './icon-examples';
import IconExplorerExample from './icon-explorer';
import SimpleExampleSource from './simple-example';

export const IconExamples: WorkbenchExample<typeof IconExamplesExample> = wb(IconExamplesExample);
export const IconExplorer: WorkbenchExample<typeof IconExplorerExample> = wb(IconExplorerExample);
export const SimpleExample: WorkbenchExample<typeof SimpleExampleSource> = wb(SimpleExampleSource);
