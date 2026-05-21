import type { Valign } from '@atlaskit/editor-common/types/valign';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

export const getLayoutColumnAtSelection = (selection: Selection | undefined): PMNode | undefined =>
	selection instanceof NodeSelection && selection.node.type.name === 'layoutColumn'
		? selection.node
		: undefined;

export const getLayoutSectionAtSelection = (
	selection: Selection | undefined,
): PMNode | undefined => {
	const selectedColumn = getLayoutColumnAtSelection(selection);
	const parent = selectedColumn ? selection?.$from.parent : undefined;

	return parent?.type.name === 'layoutSection' ? parent : undefined;
};

export const getLayoutSectionColumnCount = (layoutSection: PMNode | undefined): number =>
	layoutSection?.type.name === 'layoutSection' ? layoutSection.childCount : 0;

export const getLayoutColumnValign = (layoutColumn: PMNode | undefined): Valign | undefined =>
	layoutColumn?.attrs.valign as Valign | undefined;
