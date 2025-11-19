export const calcBreakoutWidthCss = (layout: 'full-width' | 'wide' | 'default') => {
	if (layout === 'full-width') {
		return 'min(var(--ak-editor--breakout-container-without-gutter-width), var(--ak-editor--full-width-layout-width))';
	}
	if (layout === 'wide') {
		return 'min(var(--ak-editor--breakout-container-without-gutter-width), var(--ak-editor--breakout-wide-layout-width))';
	}
	return '100%';
};
