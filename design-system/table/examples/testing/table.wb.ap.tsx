import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ExpandableExample from '../expandable';

export const Expandable: WorkbenchExample<typeof ExpandableExample> = wb(ExpandableExample);
