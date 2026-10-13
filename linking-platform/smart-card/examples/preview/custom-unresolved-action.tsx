import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { ForbiddenClient } from '@atlaskit/link-test-helpers';
import { Card } from '@atlaskit/smart-card/card/lazy';
import { CustomUnresolvedAction } from '@atlaskit/smart-card/custom-unresolved-action';
export default function Preview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<SmartCardProvider client={new ForbiddenClient()}>
				<Card appearance="block" url="https://example.atlassian.net/browse/ENG-1">
					<CustomUnresolvedAction
						forbidden={{
							FORBIDDEN: {
								id: 'example-forbidden',
								defaultMessage: 'Ask a site admin to review access',
							},
							FALLBACK: {
								id: 'example-forbidden-fallback',
								defaultMessage: 'Contact your site admin about access',
							},
						}}
					/>
				</Card>
			</SmartCardProvider>
		</div>
	);
}
