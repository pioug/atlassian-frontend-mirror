/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';

import { browser } from '@atlaskit/editor-common/browser';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import { ContextPanelWidthProvider } from '@atlaskit/editor-common/ui';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugins/editor-viewmode';
import type { InteractionPlugin } from '@atlaskit/editor-plugins/interaction';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugins/primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';
import { FULL_PAGE_EDITOR_TOOLBAR_HEIGHT } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { EditorAppearanceComponentProps, PrimaryToolbarComponents } from '../../../types';
import { getPrimaryToolbarComponents } from '../../Toolbar/getPrimaryToolbarComponents';

import { FullPageContentArea } from './FullPageContentArea';
import type { ToolbarEditorPlugins } from './FullPageToolbar';
import { FullPageToolbar } from './FullPageToolbar';
import { FullPageToolbarNext } from './FullPageToolbarNext';
import { fullPageEditorWrapper } from './StyledComponents';
import { type ScrollContainerRefs } from './types';

const useShowKeyline = (contentAreaRef: React.MutableRefObject<ScrollContainerRefs | null>) => {
	const [showKeyline, setShowKeyline] = useState<boolean>(false);

	useEffect(() => {
		if (!contentAreaRef.current?.contentArea) {
			return;
		}

		const intersection = new IntersectionObserver(
			([entry]) => {
				setShowKeyline(
					!entry.isIntersecting && entry.boundingClientRect.top < entry.intersectionRect.top,
				);
			},
			{
				root: undefined,
				// Safari seems to miss events (on fast scroll) sometimes due
				// to differences in IntersectionObserver behaviour between browsers.
				// By lowering the threshold a little it gives Safari more
				// time to catch these events.
				threshold: browser.safari ? 0.98 : 1,
			},
		);

		intersection.observe(contentAreaRef.current.contentArea);

		return () => {
			intersection.disconnect();
		};
	}, [contentAreaRef]);

	return showKeyline;
};

export type ComponentProps = EditorAppearanceComponentProps<
	[
		OptionalPlugin<EditorViewModePlugin>,
		OptionalPlugin<PrimaryToolbarPlugin>,
		OptionalPlugin<SelectionToolbarPlugin>,
		OptionalPlugin<InteractionPlugin>,
		OptionalPlugin<ToolbarPlugin>,
		...ToolbarEditorPlugins,
	]
>;

const hasCustomComponents = (components?: PrimaryToolbarComponents) => {
	if (!components) {
		return false;
	}

	if ('before' in components) {
		return (
			(Array.isArray(components.before) && components.before.length > 0) ||
			!!components.before ||
			(Array.isArray(components.after) && components.after.length > 0) ||
			!!components.after
		);
	}

	return true;
};

export const FullPageEditor = (props: ComponentProps) => {
	const wrapperElementRef = useMemo(() => props.innerRef, [props.innerRef]);
	const scrollContentContainerRef = useRef<ScrollContainerRefs | null>(null);
	const showKeyline = useShowKeyline(scrollContentContainerRef);
	const editorAPI = props.editorAPI;

	const state = useSharedPluginStateWithSelector(
		editorAPI,
		['primaryToolbar', 'interaction', 'editorViewMode'],
		(states) => ({
			primaryToolbarComponents: states.primaryToolbarState?.components,
			interactionState: states.interactionState?.interactionState,
			editorViewMode: states.editorViewModeState?.mode,
		}),
	);

	const interactionState = state.interactionState;

	const primaryToolbarState = getPrimaryToolbarComponents(
		editorAPI,
		state.primaryToolbarComponents,
	);

	const hasHadInteraction = interactionState !== 'hasNotHadInteraction';

	let toolbarDocking = useSharedPluginStateSelector(editorAPI, 'selectionToolbar.toolbarDocking', {
		disabled: fg('platform_editor_use_preferences_plugin'),
	});
	if (!fg('platform_editor_use_preferences_plugin')) {
		if (!toolbarDocking) {
			// This is a workaround for the rendering issue with the selection toolbar
			// where using useSharedPluginStateSelector or useSharedPluginState the state are not
			// available when the editor is first loaded. and cause the toolbar to blink.
			const defaultDocking = props.__livePage ? 'none' : 'top';
			toolbarDocking =
				editorAPI?.selectionToolbar?.sharedState.currentState()?.toolbarDocking ?? defaultDocking;
		}
	}

	let { toolbarDockingPosition } =
		useSharedPluginStateSelector(editorAPI, 'userPreferences.preferences', {
			disabled: !fg('platform_editor_use_preferences_plugin'),
		}) || {};
	if (fg('platform_editor_use_preferences_plugin')) {
		if (!toolbarDockingPosition) {
			// This is a workaround for the rendering issue with the selection toolbar
			// when using useSharedPluginStateWithSelector the state is not yet
			// available when the editor is first loaded.
			// This causes the toolbar to blink creating a layout shift.
			const defaultDockingPosition = props.__livePage ? 'none' : 'top';
			toolbarDockingPosition =
				editorAPI?.userPreferences?.actions.getUserPreferences()?.toolbarDockingPosition ??
				defaultDockingPosition;
		}
	}

	let primaryToolbarComponents = props.primaryToolbarComponents;

	if (Array.isArray(primaryToolbarState?.components) && Array.isArray(primaryToolbarComponents)) {
		primaryToolbarComponents = primaryToolbarState.components.concat(primaryToolbarComponents);
	}

	let isEditorToolbarHidden = state.editorViewMode === 'view';

	const { customPrimaryToolbarComponents } = props;

	if (editorExperiment('platform_editor_controls', 'variant1', { exposure: true })) {
		if (fg('platform_editor_use_preferences_plugin')) {
			// need to check if the toolbarDockingPosition is set to 'none' or 'top'
			if (toolbarDockingPosition === 'none') {
				primaryToolbarComponents = [];

				if (!hasCustomComponents(customPrimaryToolbarComponents)) {
					isEditorToolbarHidden = true;
				}
			}
		} else {
			if (toolbarDocking === 'none') {
				primaryToolbarComponents = [];

				if (!hasCustomComponents(customPrimaryToolbarComponents)) {
					isEditorToolbarHidden = true;
				}
			}
		}
	}

	const popupsBoundariesElement =
		props.popupsBoundariesElement || scrollContentContainerRef?.current?.containerArea || undefined;

	return (
		<ContextPanelWidthProvider>
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={fullPageEditorWrapper}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="akEditor"
				ref={wrapperElementRef}
				style={
					{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						'--ak-editor-fullpage-toolbar-height': FULL_PAGE_EDITOR_TOOLBAR_HEIGHT(),
					} as React.CSSProperties
				}
			>
				{!isEditorToolbarHidden &&
					(editorExperiment('platform_editor_toolbar_aifc', true) ? (
						<IntlProvider locale="en">
							<FullPageToolbarNext
								toolbarDockingPosition={toolbarDockingPosition ?? toolbarDocking}
								beforeIcon={props.primaryToolbarIconBefore}
								editorAPI={editorAPI}
								editorView={props.editorView}
								popupsMountPoint={props.popupsMountPoint}
								popupsBoundariesElement={props.popupsBoundariesElement}
								popupsScrollableElement={props.popupsScrollableElement}
								showKeyline={showKeyline}
								customPrimaryToolbarComponents={props.customPrimaryToolbarComponents}
							/>
						</IntlProvider>
					) : (
						<FullPageToolbar
							appearance={props.appearance}
							editorAPI={editorAPI}
							beforeIcon={props.primaryToolbarIconBefore}
							collabEdit={props.collabEdit}
							containerElement={scrollContentContainerRef.current?.scrollContainer ?? null}
							customPrimaryToolbarComponents={props.customPrimaryToolbarComponents}
							disabled={!!props.disabled}
							dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
							editorActions={props.editorActions}
							editorDOMElement={props.editorDOMElement}
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							editorView={props.editorView!}
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							eventDispatcher={props.eventDispatcher!}
							hasMinWidth={props.enableToolbarMinWidth}
							popupsBoundariesElement={props.popupsBoundariesElement}
							popupsMountPoint={props.popupsMountPoint}
							popupsScrollableElement={props.popupsScrollableElement}
							primaryToolbarComponents={primaryToolbarComponents}
							providerFactory={props.providerFactory}
							showKeyline={showKeyline}
							featureFlags={props.featureFlags}
						/>
					))}
				<FullPageContentArea
					editorAPI={editorAPI}
					ref={scrollContentContainerRef}
					appearance={props.appearance}
					contentComponents={props.contentComponents}
					contextPanel={props.contextPanel}
					customContentComponents={props.customContentComponents}
					disabled={props.disabled}
					dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
					editorActions={props.editorActions}
					editorDOMElement={props.editorDOMElement}
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					editorView={props.editorView!}
					eventDispatcher={props.eventDispatcher}
					popupsBoundariesElement={popupsBoundariesElement}
					popupsMountPoint={props.popupsMountPoint}
					popupsScrollableElement={props.popupsScrollableElement}
					providerFactory={props.providerFactory}
					wrapperElement={wrapperElementRef?.current ?? null}
					pluginHooks={props.pluginHooks}
					featureFlags={props.featureFlags}
					isEditorToolbarHidden={isEditorToolbarHidden}
					viewMode={state.editorViewMode}
					hasHadInteraction={hasHadInteraction}
				/>
			</div>
		</ContextPanelWidthProvider>
	);
};
