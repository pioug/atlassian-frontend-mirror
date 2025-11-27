/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
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
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type EditorActions from '../../actions';
import type {} from '../../types';
import { ErrorBoundary } from '../ErrorBoundary';

import { MountPluginHooks } from './mount-plugin-hooks';

const pluginsComponentsWrapper = css({
	display: 'flex',
});

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
}: Props) => {
	if (
		(!items && !pluginHooks) ||
		(!editorView && !expVal('platform_editor_hydratable_ui', 'isEnabled', false))
	) {
		return null;
	}

	return (
		<ErrorBoundary component={ACTION_SUBJECT.PLUGIN_SLOT} fallbackComponent={null}>
			<MountPluginHooks
				editorView={editorView}
				pluginHooks={pluginHooks}
				containerElement={containerElement}
			/>
			<div
				css={pluginsComponentsWrapper}
				data-testid={
					expVal('platform_editor_experience_tracking', 'isEnabled', false)
						? 'plugins-components-wrapper'
						: undefined
				}
			>
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
			</div>
		</ErrorBoundary>
	);
};

const PluginSlotComponent = React.memo(PluginSlot, isEqual);

PluginSlotComponent.displayName = 'PluginSlot';

export default PluginSlotComponent;
