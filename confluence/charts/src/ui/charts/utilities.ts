type Nestable = {
  type: string;
  content?: Nestable[];
  text?: string;
};

type TableRow = {
  type: 'tableHeader' | 'tableRow';
  attrs: any;
  content: Nestable[];
};

type TableData = {
  type: 'table';
  attrs: any;
  content: TableRow[];
};

const getText = (child: Nestable): string => {
  if (child.content) {
    return child.content.map(getText).join('\n');
  }

  return child.text || '';
};

// x-axis picker from column
// y-value is that column value
export const tableToColumnSet = (inputData: TableData) => {
  const firstRow = inputData.content[0];
  const seriesNames = firstRow.content.map(child => getText(child));

  const tableRawData = inputData.content.slice(1);
  const tableData = tableRawData.map(tableRow =>
    tableRow.content.map(child => Number(getText(child))),
  );

  // convert [2012, 8, 153, 121] into
  // { year: 2012, a: 8, b: 153, c: 121 }
  const namedTableData = tableData.map((dataRow, rowIdx) =>
    dataRow.reduce((namedData, colData, colIdx) => {
      namedData[seriesNames[colIdx]] = colData;
      namedData['idx'] = rowIdx;
      return namedData;
    }, {} as any),
  );

  return [seriesNames, namedTableData];
};
