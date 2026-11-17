import { envType } from '@atlassiansox/analytics-web-client/analytics-web-types';

import { createChoreographedContent } from '@atlaskit/link-provider/create-choreographed-content';
import type { SmartLinkChoreographer } from '@atlaskit/link-provider/types';
import { ProductIds } from '@atlassian/ipm-choreographer/constants';
import { choreographerFactory } from '@atlassian/ipm-choreographer/factory';

// Standalone examples use the same adapter factory as the existing product integration.
const host = choreographerFactory(ProductIds.JIRA, envType.LOCAL);
const ExampleChoreographer: SmartLinkChoreographer = createChoreographedContent(
	host.useChoreographer,
);
export default ExampleChoreographer;
