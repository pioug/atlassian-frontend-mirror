import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './01-basic';
import LateSubscriptionExample from './02-late-subscription';
import StatefulCallbackExample from './03-stateful-callback';
import ConditionalSubscriptionComponentExample from './04-conditional-subscription-component';
import IframeToPubsubIframedContentExample from './05-iframe-to-pubsub-iframed-content';
import IframeToPubsubParentContentExample from './05-iframe-to-pubsub-parent-content';

export const Basic: WorkbenchExample = wb(BasicExample);
export const LateSubscription: WorkbenchExample = wb(LateSubscriptionExample);
export const StatefulCallback: WorkbenchExample = wb(StatefulCallbackExample);
export const ConditionalSubscriptionComponent: WorkbenchExample = wb(
	ConditionalSubscriptionComponentExample,
);
export const IframeToPubsubIframedContent: WorkbenchExample = wb(
	IframeToPubsubIframedContentExample,
);
export const IframeToPubsubParentContent: WorkbenchExample = wb(IframeToPubsubParentContentExample);
