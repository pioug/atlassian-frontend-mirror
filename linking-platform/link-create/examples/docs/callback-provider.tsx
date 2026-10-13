import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { LinkCreateCallbackProvider, useLinkCreateCallback } from '@atlaskit/link-create/callback-context';
import type { CreatePayload } from '@atlaskit/link-create/types';

function CompleteExample(): React.JSX.Element {
	const { onCreate } = useLinkCreateCallback();
	return <Button onClick={() => onCreate?.({ url: 'https://example.atlassian.net/browse/DEMO-42', objectId: 'DEMO-42', objectType: 'issue' })}>Simulate creating an issue</Button>;
}

export default function CallbackProviderExample(): React.JSX.Element {
	const [created, setCreated] = useState<CreatePayload>();
	return <LinkCreateCallbackProvider onCreate={setCreated}>
		<CompleteExample />
		{created && <p>Example: would create {created.objectId} (local simulation only; nothing was saved).</p>}
	</LinkCreateCallbackProvider>;
}
