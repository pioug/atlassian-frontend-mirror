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
import type {} from '../../types';
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
				{items?.map((component, key) => {
					const props = { key };
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
