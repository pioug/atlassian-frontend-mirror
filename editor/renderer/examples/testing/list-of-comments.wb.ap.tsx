import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../18-list-of-comments';

export const ListOfComments: WorkbenchExample<typeof Example> = wb(Example);
