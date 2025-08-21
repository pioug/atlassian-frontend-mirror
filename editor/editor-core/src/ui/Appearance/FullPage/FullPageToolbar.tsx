/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactElement } from 'react';
import React, { useEffect, useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
import { ContextPanelConsumer } from '@atlaskit/editor-common/context-panel';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { fullPageMessages as messages } from '@atlaskit/editor-common/messages';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
	EditorAppearance,
	FeatureFlags,
	OptionalPlugin,
	PublicPluginAPI,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import { ToolbarArrowKeyNavigationProvider } from '@atlaskit/editor-common/ui-menu';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import type { AvatarGroupPlugin } from '@atlaskit/editor-plugins/avatar-group';
import type { BeforePrimaryToolbarPlugin } from '@atlaskit/editor-plugins/before-primary-toolbar';
import type { CollabEditPlugin } from '@atlaskit/editor-plugins/collab-edit';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
import type { FindReplacePlugin } from '@atlaskit/editor-plugins/find-replace';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { EditorActions } from '../../../index';
import type { PrimaryToolbarComponents } from '../../../types';
import { ToolbarPortalMountPoint, useToolbarPortal } from '../../Toolbar/ToolbarPortal';
import { ToolbarWithSizeDetector as Toolbar } from '../../Toolbar/ToolbarWithSizeDetector';

import { BeforePrimaryToolbarWrapper } from './BeforeWrapper';
import {
	MainToolbarForFirstChildWrapper,
	MainToolbarForSecondChildWrapper,
} from './CustomToolbarWrapper';
import {
	customToolbarWrapperStyle,
	mainToolbarIconBeforeStyle,
	MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT,
	nonCustomToolbarWrapperStyle,
} from './MainToolbar';
import { MainToolbarWrapper } from './MainToolbarWrapper';

export type ToolbarEditorPlugins = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<FindReplacePlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<CollabEditPlugin>,
	OptionalPlugin<AvatarGroupPlugin>,
	OptionalPlugin<BeforePrimaryToolbarPlugin>,
];

export interface FullPageToolbarProps {
	appearance?: EditorAppearance;
	providerFactory: ProviderFactory;
	editorActions?: EditorActions;
	editorDOMElement: JSX.Element;
	editorView: EditorView;
	eventDispatcher: EventDispatcher;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	primaryToolbarComponents?: ToolbarUIComponentFactory[];
	customPrimaryToolbarComponents?: PrimaryToolbarComponents;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	disabled: boolean;
	collabEdit?: CollabEditOptions;
	showKeyline: boolean;
	containerElement: HTMLElement | null;
	beforeIcon?: ReactElement;
	hasMinWidth?: boolean;
	featureFlags: FeatureFlags;
	editorAPI: PublicPluginAPI<ToolbarEditorPlugins> | undefined;
}

export const EditorToolbar = React.memo((props: FullPageToolbarProps & WrappedComponentProps) => {
	const [shouldSplitToolbar, setShouldSplitToolbar] = useState(false);
	const { editorAPI } = props;

	// When primary toolbar components is undefined, do not show two line editor toolbar
	const twoLineEditorToolbar = editorExperiment('platform_editor_controls', 'variant1')
		? !!props.customPrimaryToolbarComponents && props.primaryToolbarComponents?.length !== 0
		: !!props.customPrimaryToolbarComponents;

	// When a toolbar portal context is provided, render the  toolbar inside a portal.
	// Otherwise fall back to a fragment just to avoid forking rendering logic.
	const { Portal: ToolbarPortal } = useToolbarPortal() ?? { Portal: React.Fragment };
	const hasToolbarPortal = ToolbarPortal !== React.Fragment;

	const popupsMountPoint = hasToolbarPortal ? undefined : props.popupsMountPoint;

	const nonCustomToolbar = (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={nonCustomToolbarWrapperStyle}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			{props.beforeIcon && <div css={mainToolbarIconBeforeStyle}>{props.beforeIcon}</div>}
			<Toolbar
				editorView={props.editorView}
				editorActions={props.editorActions}
				eventDispatcher={props.eventDispatcher}
				providerFactory={props.providerFactory}
				appearance={props.appearance}
				items={props.primaryToolbarComponents}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={props.popupsBoundariesElement}
				popupsScrollableElement={props.popupsScrollableElement}
				disabled={props.disabled}
				dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
				containerElement={props.containerElement}
				hasMinWidth={props.hasMinWidth}
				twoLineEditorToolbar={twoLineEditorToolbar}
			/>
		</div>
	);

	const customToolbar = (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={customToolbarWrapperStyle}>
			{!!props.customPrimaryToolbarComponents &&
			'before' in props.customPrimaryToolbarComponents ? (
				<BeforePrimaryToolbarWrapper
					beforePrimaryToolbarComponents={props.customPrimaryToolbarComponents?.before}
				/>
			) : null}
			{!editorExperiment('platform_editor_controls', 'variant1') &&
			editorAPI?.findReplace &&
			twoLineEditorToolbar
				? editorAPI?.findReplace.actions.registerToolbarButton({
						popupsBoundariesElement: props.popupsBoundariesElement,
						popupsMountPoint: popupsMountPoint,
						popupsScrollableElement: props.popupsScrollableElement,
						editorView: props.editorView,
						containerElement: props.containerElement,
						dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
					})
				: null}
			{!!props.customPrimaryToolbarComponents && 'after' in props.customPrimaryToolbarComponents
				? props.customPrimaryToolbarComponents.after
				: props.customPrimaryToolbarComponents}
		</div>
	);

	useEffect(() => {
		if (twoLineEditorToolbar) {
			const updateOnResize = () => {
				setShouldSplitToolbar(window.innerWidth <= MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT);
			};
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			window.addEventListener('resize', updateOnResize);
			updateOnResize();
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			return () => window.removeEventListener('resize', updateOnResize);
		}
	});

	const isShortcutToFocusToolbarRaw = (event: KeyboardEvent) => {
		//Alt + F9 to reach first element in this main toolbar
		return event.altKey && (event.key === 'F9' || event.keyCode === 120);
	};
	const isShortcutToFocusToolbarMemoized = useCallback(isShortcutToFocusToolbarRaw, []);
	const isShortcutToFocusToolbar = editorExperiment(
		'platform_editor_toolbar_rerender_optimization_exp',
		true,
	)
		? isShortcutToFocusToolbarMemoized
		: isShortcutToFocusToolbarRaw;

	const handleEscapeRaw = (event: KeyboardEvent) => {
		if (!props.editorView?.hasFocus()) {
			props.editorView?.focus();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	const handleEscapeMemoized = useCallback(
		(event: KeyboardEvent) => {
			if (!props.editorView?.hasFocus()) {
				props.editorView?.focus();
			}
			event.preventDefault();
			event.stopPropagation();
		},
		[props.editorView],
	);

	const handleEscape = editorExperiment('platform_editor_toolbar_rerender_optimization_exp', true)
		? handleEscapeMemoized
		: handleEscapeRaw;

	return (
		<ContextPanelConsumer>
			{({ width: contextPanelWidth }) => (
				<ToolbarArrowKeyNavigationProvider
					editorView={props.editorView}
					childComponentSelector="[data-testid='ak-editor-main-toolbar']"
					isShortcutToFocusToolbar={isShortcutToFocusToolbar}
					handleEscape={handleEscape}
					intl={props.intl}
				>
					<ToolbarPortal>
						<MainToolbarWrapper
							showKeyline={props.showKeyline || contextPanelWidth > 0}
							twoLineEditorToolbar={twoLineEditorToolbar}
							data-testid="ak-editor-main-toolbar"
						>
							<MainToolbarForFirstChildWrapper
								twoLineEditorToolbar={twoLineEditorToolbar}
								role="toolbar"
								aria-label={props.intl.formatMessage(messages.toolbarLabel)}
							>
								{shouldSplitToolbar ? customToolbar : nonCustomToolbar}
							</MainToolbarForFirstChildWrapper>
							<MainToolbarForSecondChildWrapper
								twoLineEditorToolbar={twoLineEditorToolbar}
								data-testid="avatar-group-outside-plugin"
								role="region"
								aria-label={props.intl.formatMessage(messages.pageActionsLabel)}
							>
								{shouldSplitToolbar ? nonCustomToolbar : customToolbar}
							</MainToolbarForSecondChildWrapper>

							<ToolbarPortalMountPoint />
						</MainToolbarWrapper>
					</ToolbarPortal>
				</ToolbarArrowKeyNavigationProvider>
			)}
		</ContextPanelConsumer>
	);
});

export const FullPageToolbar = injectIntl(EditorToolbar);
