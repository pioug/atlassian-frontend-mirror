import React from 'react';

import CardSync from '@atlaskit/media-card/cardSync';
import type { FileIdentifier } from '@atlaskit/media-client/identifier';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';

type CardSyncExampleProps = {
	mediaClientConfig: MediaClientConfig;
	identifier: FileIdentifier;
	fileName: string;
};

export default function CardSyncExample({
	mediaClientConfig,
	identifier,
	fileName,
}: CardSyncExampleProps): React.JSX.Element {
	return (
		<figure>
			<figcaption>{fileName}</figcaption>
			<CardSync
				mediaClientConfig={mediaClientConfig}
				identifier={identifier}
				alt={`Preview of ${fileName}`}
				shouldOpenMediaViewer
			/>
		</figure>
	);
}
