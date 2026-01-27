import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { TableLayout } from '@atlaskit/adf-schema';
import type { RendererAppearance } from '../../../ui/Renderer/types';

export type SharedTableProps = {
	allowFixedColumnWidthOption?: boolean;
	allowTableResizing?: boolean;
	columnWidths?: Array<number>;
	isinsideMultiBodiedExtension?: boolean;
	isInsideOfBlockNode?: boolean;
	isInsideOfTable?: boolean;
	isNumberColumnEnabled: boolean;
	layout: TableLayout;
	rendererAppearance: RendererAppearance;
	renderWidth: number;
	tableNode?: PMNode;
};
