import type React from 'react';

import type { UiComponentFactoryParams } from './ui-components';

export enum ToolbarSize {
	XXL = 6,
	XL = 5,
	L = 4,
	M = 3,
	S = 2,
	XXXS = 1,
}

/** @deprecated
 * To be removed as part of ED-25129 in favour of ToolbarWidthsNext along with references
 * to platform_editor_toolbar_responsive_fixes feature gate
 */
export enum ToolbarWidths {
	XXL = 610,
	XL = 540,
	L = 460,
	M = 450,
	S = 410,
}

export enum ToolbarWidthsNext {
	XXL = 768,
	XL = 576,
	L = 460,
	M = 450,
	S = 410,
}

/** @deprecated
 * To be removed as part of ED-25129 in favour of ToolbarWidthsFullPageNext along with references
 * to platform_editor_toolbar_responsive_fixes feature gate
 */
export enum ToolbarWidthsFullPage {
	XXL = 650,
	XL = 580,
	L = 540,
	M = 490,
	S = 410,
}

export enum ToolbarWidthsFullPageNext {
	XXL = 1200,
	XL = 992,
	L = 768,
	M = 576,
	S = 410,
}

export type ToolbarUiComponentFactoryParams = UiComponentFactoryParams & {
	toolbarSize: ToolbarSize;
	isToolbarReducedSpacing: boolean;
	isLastItem?: boolean;
};
export type ToolbarUIComponentFactory = (
	params: ToolbarUiComponentFactoryParams,
) => React.ReactElement<any> | null;
