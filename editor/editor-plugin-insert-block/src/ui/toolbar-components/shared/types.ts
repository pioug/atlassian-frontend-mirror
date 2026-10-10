import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';

import type { InsertBlockPlugin } from '../../../insertBlockPluginType';

export interface BaseToolbarButtonProps {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
}
