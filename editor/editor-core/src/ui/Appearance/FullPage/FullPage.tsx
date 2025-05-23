/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { browser } from '@atlaskit/editor-common/browser';
import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import type { OptionalPlugin, PublicPluginAPI } from '@atlaskit/editor-common/types';
import { ContextPanelWidthProvider } from '@atlaskit/editor-common/ui';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type {
	EditorViewModePlugin,
	EditorViewModePluginState,
} from '@atlaskit/editor-plugins/editor-viewmode';
import type { InteractionPlugin } from '@atlaskit/editor-plugins/interaction';
import type {
	PrimaryToolbarPlugin,
	PrimaryToolbarPluginState,
} from '@atlaskit/editor-plugins/primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { EditorAppearanceComponentProps, PrimaryToolbarComponents } from '../../../types';

import { FullPageContentArea } from './FullPageContentArea';
import type { ToolbarEditorPlugins } from './FullPageToolbar';
import { FullPageToolbar } from './FullPageToolbar';
import { getEditorViewMode } from './getEditorViewModeSync';
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

const useFullPageEditorPluginsStates = sharedPluginStateHookMigratorFactory<
	{
		primaryToolbarState: PrimaryToolbarPluginState | undefined;
		editorViewModeState:
			| Pick<EditorViewModePluginState, 'mode' | '_showTopToolbar'>
			| undefined
			| null;
		interactionState:
			| {
					// Clean up with platform_editor_interaction_api_refactor
					hasHadInteraction: boolean;
					interactionState: null | 'hasNotHadInteraction';
			  }
			| undefined;
	},
	| PublicPluginAPI<
			[
				OptionalPlugin<EditorViewModePlugin>,
				OptionalPlugin<PrimaryToolbarPlugin>,
				OptionalPlugin<InteractionPlugin>,
			]
	  >
	| undefined
>(
	(pluginInjectionApi) => {
		return useSharedPluginState(pluginInjectionApi, [
			'editorViewMode',
			'primaryToolbar',
			'interaction',
		]);
	},
	(pluginInjectionApi) => {
		const primaryToolbarComponents = useSharedPluginStateSelector(
			pluginInjectionApi,
			'primaryToolbar.components',
		);
		const editorViewMode = useSharedPluginStateSelector(pluginInjectionApi, 'editorViewMode.mode');
		const showTopToolbar = useSharedPluginStateSelector(
			pluginInjectionApi,
			'editorViewMode._showTopToolbar',
		);
		const hasHadInteraction = useSharedPluginStateSelector(
			pluginInjectionApi,
			'interaction.hasHadInteraction',
		);
		const interactionState = useSharedPluginStateSelector(
			pluginInjectionApi,
			'interaction.interactionState',
		);

		return {
			primaryToolbarState: !primaryToolbarComponents
				? undefined
				: { components: primaryToolbarComponents },
			editorViewModeState: !editorViewMode
				? undefined
				: { mode: editorViewMode, _showTopToolbar: showTopToolbar },
			interactionState:
				hasHadInteraction === undefined || interactionState === undefined
					? undefined
					: { hasHadInteraction, interactionState },
		};
	},
);

export const FullPageEditor = (props: ComponentProps) => {
	const wrapperElementRef = useMemo(() => props.innerRef, [props.innerRef]);
	const scrollContentContainerRef = useRef<ScrollContainerRefs | null>(null);
	const showKeyline = useShowKeyline(scrollContentContainerRef);
	const editorAPI = props.editorAPI;
	const { editorViewModeState, primaryToolbarState, interactionState } =
		useFullPageEditorPluginsStates(editorAPI);
	const viewMode = getEditorViewMode(editorViewModeState, props.preset);
	const hasHadInteraction = fg('platform_editor_interaction_api_refactor')
		? interactionState?.interactionState !== 'hasNotHadInteraction'
		: Boolean(interactionState?.hasHadInteraction);

	let toolbarDocking = useSharedPluginStateSelector(editorAPI, 'selectionToolbar.toolbarDocking');

	if (!toolbarDocking && fg('platform_editor_controls_toolbar_ssr_fix')) {
		// This is a workaround for the rendering issue with the selection toolbar
		// where using useSharedPluginStateSelector or useSharedPluginState the state are not
		// available when the editor is first loaded. and cause the toolbar to blink.
		const defaultDocking = props.__livePage ? 'none' : 'top';
		toolbarDocking =
			editorAPI?.selectionToolbar?.sharedState.currentState()?.toolbarDocking ?? defaultDocking;
	}

	let primaryToolbarComponents = props.primaryToolbarComponents;

	if (Array.isArray(primaryToolbarState?.components) && Array.isArray(primaryToolbarComponents)) {
		primaryToolbarComponents = primaryToolbarState.components.concat(primaryToolbarComponents);
	}

	let isEditorToolbarHidden = fg('platform_editor_sync_editor_view_mode_state')
		? viewMode === 'view'
		: editorViewModeState?.mode === 'view';

	if (props.__livePage && !editorExperiment('live_pages_graceful_edit', 'control')) {
		// the custom toolbar logic should only be applied when the experiment cohort is not control,
		// and the editor is in live page mode.
		if (!editorViewModeState) {
			// when first loading the editor, the toolbar should be hidden for all content modes
			// the editorViewMode plugin state is not able to be relied as it will not be setup when
			// the appearance component is being rendered.
			// In this case we set the toolbar to be hidden by default.
			isEditorToolbarHidden = true;
		} else {
			if (editorExperiment('live_pages_graceful_edit', 'initially-hide-toolbar')) {
				// for the initially-hide-toolbar variant, the toolbar should be hidden based on
				// a separate flag in the editorViewMode plugin state.
				isEditorToolbarHidden = !editorViewModeState._showTopToolbar || false;
			}
		}
	}

	const { customPrimaryToolbarComponents } = props;

	if (editorExperiment('platform_editor_controls', 'variant1', { exposure: true })) {
		if (fg('platform_editor_controls_toolbar_ssr_fix')) {
			if (toolbarDocking === 'none') {
				primaryToolbarComponents = [];

				if (!hasCustomComponents(customPrimaryToolbarComponents)) {
					isEditorToolbarHidden = true;
				}
			}
		} else {
			if (toolbarDocking !== 'top') {
				primaryToolbarComponents = [];
			}

			if (
				!primaryToolbarComponents?.length &&
				!hasCustomComponents(customPrimaryToolbarComponents)
			) {
				isEditorToolbarHidden = true;
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
			>
				{!editorExperiment('live_pages_graceful_edit', 'control') && (
					<div css={hiddenStyle} data-hidden={isEditorToolbarHidden}>
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
					</div>
				)}
				{editorExperiment('live_pages_graceful_edit', 'control') && !isEditorToolbarHidden && (
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
				)}
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
					viewMode={editorViewModeState?.mode}
					hasHadInteraction={hasHadInteraction}
				/>
			</div>
		</ContextPanelWidthProvider>
	);
};

const hiddenStyle = css({
	visibility: 'visible',
	opacity: 1,
	transition: '200ms opacity, 200ms visibility, 200ms transform',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-hidden="true"]': {
		height: 0,
		visibility: 'hidden',
		opacity: 0,
		// transition: '0ms opacity, 0ms visibility, 0ms transform',
	},
});
