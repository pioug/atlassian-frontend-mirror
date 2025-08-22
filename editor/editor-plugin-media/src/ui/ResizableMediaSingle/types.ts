import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { HandlePositioning } from '@atlaskit/editor-common/resizer';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MediaSingleProps } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { MediaClientConfig } from '@atlaskit/media-core';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import type { getPosHandler } from '../../types';

export type EnabledHandles = { left?: boolean; right?: boolean };

export type Props = MediaSingleProps & {
	allowBreakoutSnapPoints?: boolean;
	containerWidth: number;
	disableHandles?: boolean;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	forceHandlePositioning?: HandlePositioning;
	fullWidthMode?: boolean;
	getPos: getPosHandler;
	gridSize: number;
	lineLength: number;
	mediaSingleWidth?: number;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	selected: boolean;
	updateSize: (width: number | null, layout: MediaSingleLayout) => void;
	view: EditorView;
	viewMediaClientConfig?: MediaClientConfig;
};
