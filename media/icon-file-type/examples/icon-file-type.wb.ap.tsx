import { wb, type WorkbenchExample } from '@atlassian/workbench';

import IconExamplesExample from './icon-examples';
import IconExplorerExample from './icon-explorer';
import SimpleExampleSource from './simple-example';

export const IconExamples: WorkbenchExample = wb(IconExamplesExample);
export const IconExplorer: WorkbenchExample = wb(IconExplorerExample);
export const SimpleExample: WorkbenchExample = wb(SimpleExampleSource);
