import { TableDefinition, TableRowDefinition } from '@atlaskit/adf-schema';

export const table = (
  ...content: Array<TableRowDefinition>
): TableDefinition => ({
  type: 'table',
  content,
});
