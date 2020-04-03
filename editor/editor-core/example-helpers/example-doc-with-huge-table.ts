const buildContent = () => {
  const NUMBER_OF_COLUMNS = 30;
  const NUMBER_OF_ROWS = 30;

  const tableCell = {
    type: 'tableCell',
    attrs: {
      colspan: 1,
      rowspan: 1,
      colwidth: null,
      background: null,
    },
    content: [{ type: 'paragraph' }],
  };

  const cellRow: object[] = [];
  const headerRow: object[] = [];
  for (let i = 0; i < NUMBER_OF_COLUMNS; i++) {
    cellRow.push(tableCell);
    headerRow.push({
      ...tableCell,
      type: 'tableHeader',
    });
  }

  const content: object[] = [];
  for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    content.push({
      type: 'tableRow',
      content: i === 0 ? headerRow : cellRow,
    });
  }

  return content;
};

export const exampleDocument = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: true,
      },
      content: buildContent(),
    },
  ],
};
