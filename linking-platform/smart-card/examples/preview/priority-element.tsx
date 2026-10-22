import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { UnicornResolvedClient } from '@atlaskit/link-test-helpers/smart-card/mocks/clients';
import { Card } from '@atlaskit/smart-card/card/lazy';
import { PriorityElement } from '@atlaskit/smart-card/flexible/priority-element';
export default function Preview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<SmartCardProvider client={new UnicornResolvedClient()}>
				<Card appearance="block" url="https://example.atlassian.net/browse/ENG-1">
					<PriorityElement />
				</Card>
			</SmartCardProvider>
		</div>
	);
}
