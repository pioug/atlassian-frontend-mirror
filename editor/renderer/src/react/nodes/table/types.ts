import { Node as PMNode } from 'prosemirror-model';
import { TableLayout } from '@atlaskit/adf-schema';

export type SharedTableProps = {
  columnWidths?: Array<number>;
  layout: TableLayout;
  isNumberColumnEnabled: boolean;
  renderWidth: number;
  tableNode?: PMNode;
};
