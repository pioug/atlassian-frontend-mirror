import { type HeadType, type HeadCellType } from '@atlaskit/dynamic-table/types';
import memoizeOne from 'memoize-one';
import { CELL_KEY_DOWNLOAD, CELL_KEY_PREVIEW } from './constants';

const generateHeadValues = memoizeOne(
	(columns: HeadType): HeadType => ({
		cells: columns.cells.map((cell: HeadCellType) =>
			cell.key === CELL_KEY_DOWNLOAD || cell.key === CELL_KEY_PREVIEW
				? { style: { width: '48px' }, ...cell }
				: cell,
		),
	}),
);

export default memoizeOne(generateHeadValues);
