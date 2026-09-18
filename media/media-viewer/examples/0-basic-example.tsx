import React, { useState } from 'react';

import { type Identifier, MediaClient } from '@atlaskit/media-client';
import {
	createStorybookMediaClientConfig,
	defaultCollectionName,
} from '@atlaskit/media-test-helpers';

import { imageItem } from '../example-helpers';
import { NativeMediaPreview } from '../example-helpers/NativeMediaPreview';
import { MediaViewer } from '../src';

const mediaClientConfig = createStorybookMediaClientConfig();
const mediaClient = new MediaClient(mediaClientConfig);

const Example = (): React.JSX.Element => {
	const [selectedIdentifier, setSelectedIdentifier] = useState<Identifier | undefined>();

	return (
		<>
			<NativeMediaPreview
				identifier={imageItem}
				mediaClient={mediaClient}
				onClick={() => setSelectedIdentifier(imageItem)}
			/>
			{selectedIdentifier && (
				<MediaViewer
					mediaClientConfig={mediaClientConfig}
					selectedItem={selectedIdentifier}
					items={[selectedIdentifier]}
					collectionName={defaultCollectionName}
					onClose={() => setSelectedIdentifier(undefined)}
				/>
			)}
		</>
	);
};

export default Example;
