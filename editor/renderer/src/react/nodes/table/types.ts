import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TableLayout } from '@atlaskit/adf-schema';
import { RendererAppearance } from '../../../ui/Renderer/types';

export type SharedTableProps = {
  columnWidths?: Array<number>;
  layout: TableLayout;
  isNumberColumnEnabled: boolean;
  renderWidth: number;
  tableNode?: PMNode;
  rendererAppearance: RendererAppearance;
};
