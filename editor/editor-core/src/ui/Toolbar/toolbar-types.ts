import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics/types/dispatch-analytics-event';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type ProviderFactory from '@atlaskit/editor-common/provider-factory/provider-factory';
import type { ToolbarSize } from '@atlaskit/editor-common/types';
import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';
import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types/toolbar';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type EditorActions from '../../actions';

export interface ToolbarBreakPoint {
	size: ToolbarSize;
	width: number;
}

export interface ToolbarProps {
	appearance?: EditorAppearance;
	containerElement: HTMLElement | null;
	disabled: boolean;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorActions?: EditorActions;
	editorView: EditorView;
	eventDispatcher: EventDispatcher;
	hasMinWidth?: boolean;
	items?: Array<ToolbarUIComponentFactory>;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	providerFactory: ProviderFactory;
	toolbarSize: ToolbarSize;
	twoLineEditorToolbar?: boolean;
}

export type ToolbarWithSizeDetectorProps = Omit<ToolbarProps, 'toolbarSize'>;

export interface ToolbarInnerProps extends ToolbarProps {
	isReducedSpacing?: boolean;
	isToolbarReducedSpacing: boolean;
}

export const toolbarTestIdPrefix = 'ak-editor-toolbar-button';
