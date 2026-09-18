import React from 'react';

import { type HeadType } from '@atlaskit/dynamic-table/types';
import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers';

import { RenderMediaTableWithFieldRange, items } from '../example-helpers/helpers';
import { MediaTable } from '../src';

const exampleItems = items.slice(0, 5);
const columns: HeadType = {
	cells: [
		{
			key: 'file',
			width: 50,
			content: 'File name',
			isSortable: true,
		},
		{
			key: 'size',
			width: 20,
			content: 'Size',
			isSortable: true,
		},
		{
			key: 'date',
			width: 50,
			content: 'Upload time',
			isSortable: true,
		},
		{
			key: 'download',
			content: '',
			width: 10,
		},
	],
};

const mediaClientConfig = createUploadMediaClientConfig();

export default (): React.JSX.Element => {
	return RenderMediaTableWithFieldRange(
		<MediaTable
			items={exampleItems}
			mediaClientConfig={mediaClientConfig}
			columns={columns}
			itemsPerPage={6}
			totalItems={5}
			pageNumber={1}
			onSetPage={(pageNumber) => console.log('onSetPage', pageNumber)}
			onSort={(key, sortOrder) => console.log('onSort', key, sortOrder)}
			onPreviewOpen={() => console.log('onPreviewOpen')}
			onPreviewClose={() => console.log('onPreviewClose')}
		/>,
	);
};
