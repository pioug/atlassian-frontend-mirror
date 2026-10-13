import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { BrowserLoader as Browser } from '@atlaskit/media-picker/browser';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers/mediaClientProvider';

export default function BrowserPreview(): React.JSX.Element {
	const [browse, setBrowse] = useState<() => void>(() => () => {});
	return (
		<div data-testid="component-preview">
			<Button onClick={() => browse()}>Choose files</Button>
			<Browser
				mediaClientConfig={createStorybookMediaClientConfig()}
				config={{ uploadParams: { collection: 'preview' }, multiple: true }}
				onBrowseFn={(openPicker) => setBrowse(() => openPicker)}
			/>
		</div>
	);
}
