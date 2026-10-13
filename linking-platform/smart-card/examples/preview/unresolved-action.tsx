import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { ForbiddenClient } from '@atlaskit/link-test-helpers';
import { Card } from '@atlaskit/smart-card/card/lazy';
import { UnresolvedAction } from '@atlaskit/smart-card/flexible/unresolved-action';
export default function Preview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<SmartCardProvider client={new ForbiddenClient()}>
				<Card appearance="block" url="https://example.atlassian.net/browse/ENG-1">
					<UnresolvedAction />
				</Card>
			</SmartCardProvider>
		</div>
	);
}
