import React, { useMemo, useState } from 'react';

import type { FileIdentifier } from '@atlaskit/media-client/identifier';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import { Filmstrip } from '@atlaskit/media-filmstrip/filmstrip';
import type { FilmstripItem } from '@atlaskit/media-filmstrip/types';

type NamedFile = {
	identifier: FileIdentifier;
	fileName: string;
};

type FilmstripExampleProps = {
	mediaClientConfig: MediaClientConfig;
	files: NamedFile[];
};

export default function FilmstripExample({
	mediaClientConfig,
	files,
}: FilmstripExampleProps): React.JSX.Element {
	const [selectedFileName, setSelectedFileName] = useState('No attachment selected.');
	const items = useMemo<FilmstripItem[]>(
		() =>
			files.map(({ identifier, fileName }) => ({
				identifier,
				onClick: () => setSelectedFileName(`${fileName} selected.`),
			})),
		[files],
	);

	return (
		<section aria-labelledby="attachments-heading">
			<h2 id="attachments-heading">Attachments</h2>
			<p aria-live="polite">{selectedFileName}</p>
			<Filmstrip items={items} mediaClientConfig={mediaClientConfig} shouldOpenMediaViewer />
		</section>
	);
}
