import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context/FabricEditorAnalyticsContext';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNode } from '@atlaskit/editor-prosemirror/utils';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

export const getAnalyticsAppearance = (
	appearance?: string,
): EDITOR_APPEARANCE_CONTEXT | undefined => {
	switch (appearance) {
		case 'full-page':
			return EDITOR_APPEARANCE_CONTEXT.FIXED_WIDTH;
		case 'full-width':
			return EDITOR_APPEARANCE_CONTEXT.FULL_WIDTH;
		case 'comment':
			return EDITOR_APPEARANCE_CONTEXT.COMMENT;
		case 'chromeless':
			return EDITOR_APPEARANCE_CONTEXT.CHROMELESS;
		case 'mobile':
			return EDITOR_APPEARANCE_CONTEXT.MOBILE;
		case 'max':
			return EDITOR_APPEARANCE_CONTEXT.MAX;
	}
};

export const getAnalyticsEditorAppearance = (editorAppearance?: string) =>
	editorAppearance ? `editor_${getAnalyticsAppearance(editorAppearance)}` : '_unknown';

export const getAnalyticsEventSeverity = (
	duration: number,
	normalThreshold: number,
	degradedThreshold: number,
) => {
	if (duration > normalThreshold && duration <= degradedThreshold) {
		return SEVERITY.DEGRADED;
	}
	if (duration > degradedThreshold) {
		return SEVERITY.BLOCKING;
	}

	return SEVERITY.NORMAL;
};

export function findInsertLocation(selection: Selection): string {
	const { schema, name } = selection.$from.doc.type;
	if (selection instanceof NodeSelection) {
		return selection.node.type.name;
	}

	if (selection instanceof CellSelection) {
		return schema.nodes.table.name;
	}

	// Text selection
	const parentNodeInfo = findParentNode((node) => node.type !== schema.nodes.paragraph)(selection);

	return parentNodeInfo ? parentNodeInfo.node.type.name : name;
}

export enum SEVERITY {
	NORMAL = 'normal',
	DEGRADED = 'degraded',
	BLOCKING = 'blocking',
}

export const analyticsEventKey = 'EDITOR_ANALYTICS_EVENT';

const EDITOR_BREAKPOINT_WIDTH = {
	S: 760,
	M: 1600,
	L: Infinity,
};

export type EditorBreakpointKey = keyof typeof EDITOR_BREAKPOINT_WIDTH;

const TABLE_BREAKPOINT_KEYS = Object.keys(EDITOR_BREAKPOINT_WIDTH) as EditorBreakpointKey[];

export const getBreakpointKey = (width: number): EditorBreakpointKey => {
	return TABLE_BREAKPOINT_KEYS.find((key) => width <= EDITOR_BREAKPOINT_WIDTH[key]) || 'L';
};
