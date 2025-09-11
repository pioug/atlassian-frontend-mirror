import type React from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { DispatchAnalyticsEvent } from '../analytics/types/dispatch-analytics-event';
import type { EventDispatcher } from '../event-dispatcher';
import type { ProviderFactory } from '../provider-factory';

import type { EditorActionsOptions } from './editor-actions';
import type { EditorAppearance } from './editor-appearance';

export type UiComponentFactoryParams = {
	appearance: EditorAppearance;
	containerElement: HTMLElement | null;
	disabled: boolean;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorActions: EditorActionsOptions;
	editorView?: EditorView;
	eventDispatcher: EventDispatcher;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	providerFactory: ProviderFactory;
	wrapperElement: HTMLElement | null;
};
export type UIComponentFactory = (
	params: UiComponentFactoryParams,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => React.ReactElement<any> | null;

export type ReactHookFactory = (
	params: Pick<UiComponentFactoryParams, 'editorView' | 'containerElement'> & {
		editorView: EditorView;
	},
) => void;
