import React, { useState } from 'react';

import LinkPicker from '@atlaskit/link-picker/link-picker';
import type { LinkPickerProps } from '@atlaskit/link-picker/types';

type SubmittedLink = Pick<Parameters<LinkPickerProps['onSubmit']>[0], 'url' | 'displayText'>;

export default function ManualLinkExample(): React.JSX.Element {
	const [link, setLink] = useState<SubmittedLink | null>(null);
	const [message, setMessage] = useState('');

	return (
		<section aria-labelledby="insert-project-link-heading">
			<h2 id="insert-project-link-heading">Insert a project link</h2>
			<LinkPicker
				url={link?.url}
				displayText={link?.displayText}
				onSubmit={({ url, displayText }) => {
					setLink({ url, displayText });
					setMessage('Link added to the draft.');
				}}
				onCancel={() => setMessage('Link selection cancelled.')}
			/>
			{message && <p role="status">{message}</p>}
		</section>
	);
}
