import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { Card } from '@atlaskit/smart-card/card/lazy';
import { CustomUnresolvedAction } from '@atlaskit/smart-card/custom-unresolved-action';
import { CopyLinkAction } from '@atlaskit/smart-card/flexible/copy-link-action';
import { CustomAction } from '@atlaskit/smart-card/flexible/custom-action';
import { DownloadAction } from '@atlaskit/smart-card/flexible/download-action';
import { FollowAction } from '@atlaskit/smart-card/flexible/follow-action';
import { PreviewAction } from '@atlaskit/smart-card/flexible/preview-action';
import { UnresolvedAction } from '@atlaskit/smart-card/flexible/unresolved-action';

type Props = {
	client: React.ComponentProps<typeof SmartCardProvider>['client'];
	/** Supply a host client that returns an unauthorized or forbidden state for the second card. */
	unresolvedClient: React.ComponentProps<typeof SmartCardProvider>['client'];
};

export default function FlexibleActionsExample({
	client,
	unresolvedClient,
}: Props): React.JSX.Element {
	const [message, setMessage] = React.useState('');
	return (
		<div>
			<SmartCardProvider client={client}>
				<Card appearance="block" url="https://example.atlassian.net/browse/ENG-1">
					<CopyLinkAction />
					<CustomAction onClick={() => setMessage('Host action selected')}>
						Open settings
					</CustomAction>
					<DownloadAction />
					<FollowAction />
					<PreviewAction />
				</Card>
			</SmartCardProvider>
			<p role="status">{message}</p>
			<SmartCardProvider client={unresolvedClient}>
				<Card appearance="block" url="https://example.atlassian.net/browse/RESTRICTED-1">
					<UnresolvedAction />
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
