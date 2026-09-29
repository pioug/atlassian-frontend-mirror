import { wb, type WorkbenchExample } from '@atlassian/workbench';

import UserNodesExample from '../01-user-nodes';

export const UserNodes: WorkbenchExample<typeof UserNodesExample> = wb(UserNodesExample);
