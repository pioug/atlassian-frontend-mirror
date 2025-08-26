import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { InsertBlockPlugin } from '../../../insertBlockPluginType';

export interface BaseToolbarButtonProps {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
}
