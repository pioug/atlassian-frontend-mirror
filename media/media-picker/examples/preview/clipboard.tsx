import React, { useState } from 'react';

import { ClipboardLoader as Clipboard } from '@atlaskit/media-picker/clipboard';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers/mediaClientProvider';
import TextArea from '@atlaskit/textarea/text-area';

export default function ClipboardPreview(): React.JSX.Element {
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	return (
		<div data-testid="component-preview">
			<div ref={setContainer}>
				<TextArea aria-label="Paste a file to upload" placeholder="Paste a file here" />
			</div>
			{container && (
				<Clipboard
					mediaClientConfig={createStorybookMediaClientConfig()}
					config={{ container, uploadParams: { collection: 'preview' } }}
				/>
			)}
		</div>
	);
}
