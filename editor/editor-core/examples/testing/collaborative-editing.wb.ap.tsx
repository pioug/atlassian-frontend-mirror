import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../21-collaborative-editing';

export const CollaborativeEditing: WorkbenchExample<typeof Example> = wb(Example);
