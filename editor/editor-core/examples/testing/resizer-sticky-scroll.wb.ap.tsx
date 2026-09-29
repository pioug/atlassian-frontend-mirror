import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../1000-resizer-sticky-scroll';

export const ResizerStickyScroll: WorkbenchExample<typeof Example> = wb(Example);
