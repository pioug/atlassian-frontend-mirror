import React from 'react';

import isEqual from 'lodash/isEqual';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
	EditorAppearance,
	ReactHookFactory,
	UIComponentFactory,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type EditorActions from '../../actions';
import { ErrorBoundary } from '../ErrorBoundary';

import { MountPluginHooks } from './mount-plugin-hooks';
import { PluginsComponentsWrapperCompiled } from './PluginSlot-compiled';
import { PluginsComponentsWrapperEmotion } from './PluginSlot-emotion';

const PluginsComponentsWrapperMigration = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	PluginsComponentsWrapperCompiled,
	PluginsComponentsWrapperEmotion,
);

export interface Props {
	appearance?: EditorAppearance;
	containerElement: HTMLElement | null;
	contentArea?: HTMLElement;
	disabled: boolean;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorActions?: EditorActions;
	editorView?: EditorView;
	eventDispatcher?: EventDispatcher;
	items?: UIComponentFactory[];
	pluginHooks?: ReactHookFactory[];
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	providerFactory: ProviderFactory;
	wrapperElement: HTMLElement | null;
}

type PluginComponentProps = Pick<
	Props,
	| 'appearance'
	| 'containerElement'
	| 'disabled'
	| 'dispatchAnalyticsEvent'
	| 'editorActions'
	| 'editorView'
	| 'eventDispatcher'
	| 'popupsBoundariesElement'
	| 'popupsMountPoint'
	| 'popupsScrollableElement'
	| 'providerFactory'
	| 'wrapperElement'
> & {
	component: UIComponentFactory;
};

const PluginComponent = ({
	component,
	editorView,
	editorActions,
	eventDispatcher,
	providerFactory,
	appearance,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	containerElement,
	disabled,
	dispatchAnalyticsEvent,
	wrapperElement,
}: PluginComponentProps) => {
	return component({
		editorView: editorView as EditorView,
		editorActions: editorActions as EditorActions,
		eventDispatcher: eventDispatcher as EventDispatcher,
		providerFactory,
		dispatchAnalyticsEvent,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		appearance: appearance!,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		containerElement,
		disabled,
		wrapperElement,
	});
};

const PluginSlot = ({
	items,
	editorView,
	editorActions,
	eventDispatcher,
	providerFactory,
	appearance,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	containerElement,
	disabled,
	dispatchAnalyticsEvent,
	wrapperElement,
	pluginHooks,
}: Props): JSX.Element | null => {
	if (!items && !pluginHooks) {
		return null;
	}

	const isolatePluginSlotFailures =
		Boolean(items?.length) &&
		expValEquals('platform_editor_per_plugin_error_boundary', 'isEnabled', true);

	return (
		<ErrorBoundary component={ACTION_SUBJECT.PLUGIN_SLOT} fallbackComponent={null}>
			<MountPluginHooks
				editorView={editorView}
				pluginHooks={pluginHooks}
				containerElement={containerElement}
			/>
			<PluginsComponentsWrapperMigration data-testid="plugins-components-wrapper">
				{/**
				 * Why don't we do this as:
				 * ```tsx
				 * items?.map((Component, key) =>
				 *   <Component key={key} editorView={editorView} {...otherProps}
				 * )
				 * ```
				 *
				 * After a performance profile it seems that this is much more performant.
				 */}
				{items?.map((component, index) => {
					if (isolatePluginSlotFailures) {
						return (
							// The wrapper adds a small amount of overhead, but moves the plugin factory call
							// inside the per-plugin boundary while still invoking it as a factory.
							<ErrorBoundary
								// Switching to a data-derived key currently breaks editor-plugin-ai's
								// Discard flow (which relies on positional remounts to reset modal
								// state). Tracked for follow-up behind a separate gate.
								// eslint-disable-next-line react/no-array-index-key
								key={index}
								component={ACTION_SUBJECT.PLUGIN_SLOT}
								dispatchAnalyticsEvent={dispatchAnalyticsEvent}
								fallbackComponent={null}
							>
								<PluginComponent
									component={component}
									editorView={editorView}
									editorActions={editorActions}
									eventDispatcher={eventDispatcher}
									providerFactory={providerFactory}
									appearance={appearance}
									popupsMountPoint={popupsMountPoint}
									popupsBoundariesElement={popupsBoundariesElement}
									popupsScrollableElement={popupsScrollableElement}
									containerElement={containerElement}
									disabled={disabled}
									dispatchAnalyticsEvent={dispatchAnalyticsEvent}
									wrapperElement={wrapperElement}
								/>
							</ErrorBoundary>
						);
					}

					const props = { key: index };
					const element = component({
						editorView: editorView as EditorView,
						editorActions: editorActions as EditorActions,
						eventDispatcher: eventDispatcher as EventDispatcher,
						providerFactory,
						dispatchAnalyticsEvent,
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						appearance: appearance!,
						popupsMountPoint,
						popupsBoundariesElement,
						popupsScrollableElement,
						containerElement,
						disabled,
						wrapperElement,
					});
					return element && React.cloneElement(element, props);
				})}
			</PluginsComponentsWrapperMigration>
		</ErrorBoundary>
	);
};

const PluginSlotComponent: React.MemoExoticComponent<
	({
		items,
		editorView,
		editorActions,
		eventDispatcher,
		providerFactory,
		appearance,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		containerElement,
		disabled,
		dispatchAnalyticsEvent,
		wrapperElement,
		pluginHooks,
	}: Props) => JSX.Element | null
> = React.memo(PluginSlot, isEqual);

PluginSlotComponent.displayName = 'PluginSlot';

export default PluginSlotComponent;
