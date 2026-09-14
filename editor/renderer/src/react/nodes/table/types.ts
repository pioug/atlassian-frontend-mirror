import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Layout as TableLayout } from '@atlaskit/adf-schema/tableNodes';
import type { RendererAppearance } from '../../../ui/Renderer/types';

export type SharedTableProps = {
	allowFixedColumnWidthOption?: boolean;
	allowTableResizing?: boolean;
	columnWidths?: Array<number>;
	isinsideMultiBodiedExtension?: boolean;
	isInsideOfBlockNode?: boolean;
	isInsideOfNestedRenderer?: boolean;
	isInsideOfTable?: boolean;
	isNumberColumnEnabled: boolean;
	layout: TableLayout;
	rendererAppearance: RendererAppearance;
	renderWidth: number;
	tableNode?: PMNode;
};
