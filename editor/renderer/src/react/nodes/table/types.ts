import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { TableLayout } from '@atlaskit/adf-schema';
import type { RendererAppearance } from '../../../ui/Renderer/types';

export type SharedTableProps = {
	columnWidths?: Array<number>;
	layout: TableLayout;
	isNumberColumnEnabled: boolean;
	renderWidth: number;
	tableNode?: PMNode;
	rendererAppearance: RendererAppearance;
	isInsideOfBlockNode?: boolean;
	isInsideOfTable?: boolean;
	isinsideMultiBodiedExtension?: boolean;
	allowTableResizing?: boolean;
};
