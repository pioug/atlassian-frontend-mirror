// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { VisibilityContainer } from './visibility-container';
export { refreshAnchorName } from './utils/anchor-name';
export { getAnchorAttrName } from './utils/dom-attr-name';
export {
	rootElementGap,
	STICKY_CONTROLS_TOP_MARGIN_FOR_STICKY_HEADER,
	topPositionAdjustment,
} from './consts';
export {
	getControlBottomCSSValue,
	getControlHeightCSSValue,
	getNodeHeight,
	getTopPosition,
	shouldBeSticky,
} from '../pm-plugins/utils/drag-handle-positions';
export { getRightPositionForRootElement } from '../pm-plugins/utils/widget-positions';
