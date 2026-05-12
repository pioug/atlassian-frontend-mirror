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
		pluginName?: string;
	},
) => void;

/**
 * A `ReactHookFactory` annotated with the name of the plugin that owns it.
 * `processPluginsList` wraps each plugin's `usePluginHook` with `.bind(null)`
 * and assigns `pluginName`, so the original plugin function reference is
 * never mutated. `MountPluginHooks` reads `pluginName` to derive a stable
 * React `key` per plugin instead of relying on array index, which would
 * violate the Rules of Hooks across reconfigures that change the plugin set.
 */
export type NamedReactHookFactory = ReactHookFactory & { pluginName?: string };
