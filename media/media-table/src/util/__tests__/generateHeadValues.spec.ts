import generateHeadValues from '../generateHeadValues';
import { HeadType, HeadCellType } from '@atlaskit/dynamic-table/types';

const cells: HeadCellType[] = [
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
    isSortable: false,
  },
];

const columns: HeadType = {
  cells,
};

const columnsWithDownload: HeadType = {
  cells: [
    ...cells,
    {
      key: 'download',
      content: '',
      width: 10,
    },
  ],
};

describe('generateHeadValues', () => {
  it('returns the header cells if download column is not present', () => {
    expect(generateHeadValues(columns)).toEqual(columns);
  });

  it('adds fixed width to the download column', () => {
    expect(generateHeadValues(columnsWithDownload)).toEqual({
      cells: [
        ...cells,
        {
          key: 'download',
          content: '',
          width: 10,
          style: {
            width: '48px',
          },
        },
      ],
    });
  });
});
