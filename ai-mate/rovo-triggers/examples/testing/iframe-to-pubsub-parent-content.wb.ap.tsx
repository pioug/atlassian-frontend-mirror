import { wb, type WorkbenchExample } from '@atlassian/workbench';

import IframeToPubsubParentContentExample from '../05-iframe-to-pubsub-parent-content';

export const IframeToPubsubParentContent: WorkbenchExample<
	typeof IframeToPubsubParentContentExample
> = wb(IframeToPubsubParentContentExample);
