import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ResourcedMentionListExample from '../04-resourced-mention-list';

export const ResourcedMentionList: WorkbenchExample<typeof ResourcedMentionListExample> = wb(
	ResourcedMentionListExample,
);
