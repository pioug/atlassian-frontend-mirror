import { type RichMediaLayout } from '@atlaskit/adf-schema';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { type MediaClientConfig } from '@atlaskit/media-core';

import type { DispatchAnalyticsEvent } from '../../analytics';
import type { getPosHandler } from '../../react-node-view';
import type { GridType } from '../../types';
import type { MediaSingleProps } from '../../ui';

export type EnabledHandles = { left?: boolean; right?: boolean };

export type Props = MediaSingleProps & {
	allowBreakoutSnapPoints?: boolean;
	containerWidth: number;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	displayGrid:
		| ((show: boolean, type: GridType, highlight: number[] | string[]) => void)
		| undefined;
	fullWidthMode?: boolean;
	getPos: getPosHandler;
	gridSize: number;
	lineLength: number;
	selected?: boolean;
	updateSize: (width: number | null, layout: RichMediaLayout) => void;
	updateWidth?: (newWidth: number) => void;
	view: EditorView;
	viewMediaClientConfig?: MediaClientConfig;
};
