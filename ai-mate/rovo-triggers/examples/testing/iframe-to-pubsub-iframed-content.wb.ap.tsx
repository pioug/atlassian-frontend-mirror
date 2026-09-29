import { wb, type WorkbenchExample } from '@atlassian/workbench';

import IframeToPubsubIframedContentExample from '../05-iframe-to-pubsub-iframed-content';

export const IframeToPubsubIframedContent: WorkbenchExample<
	typeof IframeToPubsubIframedContentExample
> = wb(IframeToPubsubIframedContentExample);
