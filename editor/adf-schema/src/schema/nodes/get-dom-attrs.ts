import type { DOMAttributes } from './panel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDomAttrs = (nodeAttrs: { [key: string]: any }): DOMAttributes => {
	const attrs: DOMAttributes = {
		'data-panel-type': nodeAttrs.panelType,
		'data-panel-icon': nodeAttrs.panelIcon,
		'data-panel-icon-id': nodeAttrs.panelIconId,
		'data-panel-icon-text': nodeAttrs.panelIconText,
		'data-panel-color': nodeAttrs.panelColor,
		'data-local-id': nodeAttrs?.localId || undefined,
	};

	return attrs;
};
