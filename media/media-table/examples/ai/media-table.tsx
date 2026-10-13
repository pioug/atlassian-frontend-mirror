import React from 'react';

import type { HeadType } from '@atlaskit/dynamic-table/types';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import MediaTable from '@atlaskit/media-table/media-table';
import type { MediaTableItem } from '@atlaskit/media-table/types';

type MediaTableExampleProps = {
	mediaClientConfig: MediaClientConfig;
	pageItems: MediaTableItem[];
};

const columns: HeadType = {
	cells: [
		{ key: 'name', content: 'File name' },
		{ key: 'updated', content: 'Last updated' },
	],
};

export default function AttachmentTable({
	mediaClientConfig,
	pageItems,
}: MediaTableExampleProps): React.JSX.Element {
	return (
		<MediaTable
			mediaClientConfig={mediaClientConfig}
			items={pageItems}
			columns={columns}
			totalItems={pageItems.length}
		/>
	);
}
