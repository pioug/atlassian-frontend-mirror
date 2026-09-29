import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ScrollingExample from '../3-scrolling';

export const Scrolling: WorkbenchExample<typeof ScrollingExample> = wb(ScrollingExample);
