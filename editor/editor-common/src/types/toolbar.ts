import type React from 'react';

import type { ToolbarSize } from './ToolbarSize';
import type { UiComponentFactoryParams } from './ui-components';

export type ToolbarUiComponentFactoryParams = UiComponentFactoryParams & {
	isLastItem?: boolean;
	isToolbarReducedSpacing: boolean;
	toolbarSize: ToolbarSize;
};
export type ToolbarUIComponentFactory = (
	params: ToolbarUiComponentFactoryParams,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => React.ReactElement<any> | null;
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { ToolbarSize } from './ToolbarSize';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { ToolbarWidths } from './ToolbarWidths';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { ToolbarWidthsNext } from './ToolbarWidthsNext';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { ToolbarWidthsFullPage } from './ToolbarWidthsFullPage';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { ToolbarWidthsFullPageNext } from './ToolbarWidthsFullPageNext';
