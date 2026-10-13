import React, { useState } from 'react';

import { DropzoneLoader as Dropzone } from '@atlaskit/media-picker/dropzone';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers/mediaClientProvider';

export default function DropzonePreview(): React.JSX.Element {
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	return (
		<div data-testid="component-preview">
			<div ref={setContainer} role="group" aria-label="Drop files to upload">
				Drop files here
			</div>
			{container && (
				<Dropzone
					mediaClientConfig={createStorybookMediaClientConfig()}
					config={{ container, uploadParams: { collection: 'preview' } }}
				/>
			)}
		</div>
	);
}
