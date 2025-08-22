import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { GetEditorContainerWidth, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { PluginInjectionAPI } from '../types';

export type TableOptions = {
	isChromelessEditor?: boolean;
	isCommentEditor?: boolean;
	isDragAndDropEnabled?: boolean;
	isFullWidthModeEnabled?: boolean;
	isTableScalingEnabled?: boolean;
	shouldUseIncreasedScalingPercent?: boolean;
	wasFullWidthModeEnabled?: boolean;
};

export interface Props {
	allowColumnResizing?: boolean;
	allowControls?: boolean;
	allowTableAlignment?: boolean;
	allowTableResizing?: boolean;
	cellMinWidth?: number;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	eventDispatcher: EventDispatcher;
	getEditorContainerWidth: GetEditorContainerWidth;
	getEditorFeatureFlags: GetEditorFeatureFlags;
	getPos: () => number | undefined;
	node: PmNode;
	options?: TableOptions;
	pluginInjectionApi?: PluginInjectionAPI;
	portalProviderAPI: PortalProviderAPI;
	view: EditorView;
}
