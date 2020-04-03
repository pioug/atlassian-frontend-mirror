import { TableCellDefinition, CellAttributes } from '@atlaskit/adf-schema';

export const tableCell = (attrs?: CellAttributes) => (
  ...content: TableCellDefinition['content']
): TableCellDefinition => ({
  type: 'tableCell',
  attrs,
  content,
});
