import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { Card } from '@atlaskit/smart-card/card/lazy';
import { AttachmentCountElement } from '@atlaskit/smart-card/flexible/attachment-count-element';
import { ChecklistProgressElement } from '@atlaskit/smart-card/flexible/checklist-progress-element';
import { CommentCountElement } from '@atlaskit/smart-card/flexible/comment-count-element';
import { CreatedOnElement } from '@atlaskit/smart-card/flexible/created-on-element';
import { DueOnElement } from '@atlaskit/smart-card/flexible/due-on-element';
import { ModifiedOnElement } from '@atlaskit/smart-card/flexible/modified-on-element';
import { ReactCountElement } from '@atlaskit/smart-card/flexible/react-count-element';
import { SentOnElement } from '@atlaskit/smart-card/flexible/sent-on-element';
import { StoryPointsElement } from '@atlaskit/smart-card/flexible/story-points-element';
import { SubTasksProgressElement } from '@atlaskit/smart-card/flexible/sub-tasks-progress-element';
import { SubscriberCountElement } from '@atlaskit/smart-card/flexible/subscriber-count-element';
import { ViewCountElement } from '@atlaskit/smart-card/flexible/view-count-element';
import { VoteCountElement } from '@atlaskit/smart-card/flexible/vote-count-element';

type ExampleProps = {
	/** The host supplies the Smart Link client and its permission-aware resolution behavior. */
	client: React.ComponentProps<typeof SmartCardProvider>['client'];
};

export default function FlexibleElementsExample({ client }: ExampleProps): React.JSX.Element {
	return (
		<SmartCardProvider client={client}>
			<Card appearance="block" url="https://example.atlassian.net/browse/ENG-1">
				<div>
					<AttachmentCountElement />
					<ChecklistProgressElement />
					<CommentCountElement />
					<CreatedOnElement />
					<DueOnElement />
					<ModifiedOnElement />
					<ReactCountElement />
					<SentOnElement />
					<StoryPointsElement />
					<SubTasksProgressElement />
					<SubscriberCountElement />
					<ViewCountElement />
					<VoteCountElement />
				</div>
			</Card>
		</SmartCardProvider>
	);
}
