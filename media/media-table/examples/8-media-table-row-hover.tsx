/**@jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers';
import { type HeadType } from '@atlaskit/dynamic-table/types';
import { MediaTable } from '../src';
import { RenderMediaTableWithFieldRange, generateItems } from '../example-helpers/helpers';

import {
	greenOnHoverStyles,
	ROW_CLASSNAME,
	ROW_HIGHLIGHT_CLASSNAME,
} from '../example-helpers/styles';

const NUM_ITEMS = 50;
const items = generateItems(NUM_ITEMS).map((item, index) => ({
	...item,
	data: {
		...item.data,
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		hover: <div css={greenOnHoverStyles} />,
	},
	rowProps: {
		className: `${ROW_CLASSNAME}${index === 2 ? ` ${ROW_HIGHLIGHT_CLASSNAME}` : ''}`,
	},
}));

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
			key: 'hover',
			width: 10,
			content: 'Hovered?',
		},
	],
};

const mediaClientConfig = createUploadMediaClientConfig();

export default () => {
	return RenderMediaTableWithFieldRange(
		<MediaTable
			items={items}
			mediaClientConfig={mediaClientConfig}
			columns={columns}
			itemsPerPage={NUM_ITEMS}
			totalItems={NUM_ITEMS}
			isLoading={false}
			pageNumber={1}
			onSetPage={(pageNumber) => console.log('onSetPage', pageNumber)}
			onSort={(key, sortOrder) => console.log('onSort', key, sortOrder)}
			onPreviewOpen={() => console.log('onPreviewOpen')}
			onPreviewClose={() => console.log('onPreviewClose')}
		/>,
	);
};
