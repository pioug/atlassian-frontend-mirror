import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context/FabricEditorAnalyticsContext';

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

export enum SEVERITY {
	NORMAL = 'normal',
	DEGRADED = 'degraded',
	BLOCKING = 'blocking',
}

export const analyticsEventKey = 'EDITOR_ANALYTICS_EVENT';
