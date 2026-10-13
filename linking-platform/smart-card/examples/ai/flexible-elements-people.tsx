import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { Card } from '@atlaskit/smart-card/card/lazy';
import { AssignedToElement } from '@atlaskit/smart-card/flexible/assigned-to-element';
import { AssignedToGroupElement } from '@atlaskit/smart-card/flexible/assigned-to-group-element';
import { AuthorGroupElement } from '@atlaskit/smart-card/flexible/author-group-element';
import { CollaboratorGroupElement } from '@atlaskit/smart-card/flexible/collaborator-group-element';
import { CreatedByElement } from '@atlaskit/smart-card/flexible/created-by-element';
import { ModifiedByElement } from '@atlaskit/smart-card/flexible/modified-by-element';
import { OwnedByElement } from '@atlaskit/smart-card/flexible/owned-by-element';
import { OwnedByGroupElement } from '@atlaskit/smart-card/flexible/owned-by-group-element';

type ExampleProps = {
	/** The host supplies the Smart Link client and its permission-aware resolution behavior. */
	client: React.ComponentProps<typeof SmartCardProvider>['client'];
};

export default function FlexibleElementsExample({ client }: ExampleProps): React.JSX.Element {
	return (
		<SmartCardProvider client={client}>
			<Card appearance="block" url="https://example.atlassian.net/browse/ENG-1">
				<div>
					<AssignedToElement />
					<AssignedToGroupElement />
					<AuthorGroupElement />
					<CollaboratorGroupElement />
					<CreatedByElement />
					<ModifiedByElement />
					<OwnedByElement />
					<OwnedByGroupElement />
				</div>
			</Card>
		</SmartCardProvider>
	);
}
