
import { getAnalyticsAppearance } from './getAnalyticsAppearance';
import { SEVERITY } from './SEVERITY';

export const getAnalyticsEditorAppearance = (editorAppearance?: string): string =>
	editorAppearance ? `editor_${getAnalyticsAppearance(editorAppearance)}` : '_unknown';

export const getAnalyticsEventSeverity = (
	duration: number,
	normalThreshold: number,
	degradedThreshold: number,
): SEVERITY => {
	if (duration > normalThreshold && duration <= degradedThreshold) {
		return SEVERITY.DEGRADED;
	}
	if (duration > degradedThreshold) {
		return SEVERITY.BLOCKING;
	}

	return SEVERITY.NORMAL;
};

export const analyticsEventKey = 'EDITOR_ANALYTICS_EVENT';

const EDITOR_BREAKPOINT_WIDTH: {
	S: number;
	M: number;
	L: number;
} = {
	S: 760,
	M: 1600,
	L: Infinity,
};

export type EditorBreakpointKey = keyof typeof EDITOR_BREAKPOINT_WIDTH;

const TABLE_BREAKPOINT_KEYS = Object.keys(EDITOR_BREAKPOINT_WIDTH) as EditorBreakpointKey[];

export const getBreakpointKey = (width: number): EditorBreakpointKey => {
	return TABLE_BREAKPOINT_KEYS.find((key) => width <= EDITOR_BREAKPOINT_WIDTH[key]) || 'L';
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getAnalyticsAppearance } from './getAnalyticsAppearance';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { findInsertLocation } from './findInsertLocation';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { SEVERITY } from './SEVERITY';
