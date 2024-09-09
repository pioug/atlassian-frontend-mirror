/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactElement } from 'react';
import React, { useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { fullPageMessages as messages } from '@atlaskit/editor-common/messages';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { OptionalPlugin, PublicPluginAPI } from '@atlaskit/editor-common/types';
import { ContextPanelConsumer } from '@atlaskit/editor-common/ui';
import { ToolbarArrowKeyNavigationProvider } from '@atlaskit/editor-common/ui-menu';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import type { AvatarGroupPlugin } from '@atlaskit/editor-plugins/avatar-group';
import type { BeforePrimaryToolbarPlugin } from '@atlaskit/editor-plugins/before-primary-toolbar';
import type { CollabEditPlugin } from '@atlaskit/editor-plugins/collab-edit';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
import type { FindReplacePlugin } from '@atlaskit/editor-plugins/find-replace';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { EditorActions } from '../../../index';
import type {
	EditorAppearance,
	PrimaryToolbarComponents,
	ToolbarUIComponentFactory,
} from '../../../types';
import type { FeatureFlags } from '../../../types/feature-flags';
import Toolbar from '../../Toolbar';

import { BeforePrimaryToolbarWrapper } from './BeforeWrapper';
import {
	customToolbarWrapperStyle,
	mainToolbarFirstChildStyle,
	mainToolbarIconBeforeStyle,
	mainToolbarSecondChildStyle,
	mainToolbarStyle,
	MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT,
	nonCustomToolbarWrapperStyle,
} from './MainToolbar';

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
	const twoLineEditorToolbar =
		!!props.customPrimaryToolbarComponents && !!props.featureFlags?.twoLineEditorToolbar;

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
				popupsMountPoint={props.popupsMountPoint}
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
			{twoLineEditorToolbar &&
			!!props.customPrimaryToolbarComponents &&
			'before' in props.customPrimaryToolbarComponents ? (
				<BeforePrimaryToolbarWrapper
					beforePrimaryToolbarComponents={props.customPrimaryToolbarComponents?.before}
				/>
			) : null}
			{editorAPI?.findReplace && twoLineEditorToolbar
				? editorAPI?.findReplace.actions.getToolbarButton({
						popupsBoundariesElement: props.popupsBoundariesElement,
						popupsMountPoint: props.popupsMountPoint,
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
			window.addEventListener('resize', updateOnResize);
			updateOnResize();
			return () => window.removeEventListener('resize', updateOnResize);
		}
	});

	const isShortcutToFocusToolbar = (event: KeyboardEvent) => {
		//Alt + F9 to reach first element in this main toolbar
		return event.altKey && (event.key === 'F9' || event.keyCode === 120);
	};

	const handleEscape = (event: KeyboardEvent) => {
		if (!fg('editor-fix-esc-main-toolbar-navigation')) {
			if (!props.popupsMountPoint) {
				return;
			}
		}

		if (!props.editorView?.hasFocus()) {
			props.editorView?.focus();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	return (
		<ContextPanelConsumer>
			{({ width: contextPanelWidth }) => (
				<ToolbarArrowKeyNavigationProvider
					editorView={props.editorView}
					childComponentSelector={"[data-testid='ak-editor-main-toolbar']"}
					isShortcutToFocusToolbar={isShortcutToFocusToolbar}
					handleEscape={handleEscape}
					intl={props.intl}
				>
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						css={mainToolbarStyle(props.showKeyline || contextPanelWidth > 0, twoLineEditorToolbar)}
						data-testid="ak-editor-main-toolbar"
					>
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
							css={mainToolbarFirstChildStyle(twoLineEditorToolbar)}
							role="toolbar"
							aria-label={props.intl.formatMessage(messages.toolbarLabel)}
						>
							{shouldSplitToolbar ? customToolbar : nonCustomToolbar}
						</div>
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
							css={mainToolbarSecondChildStyle(twoLineEditorToolbar)}
							data-testid={'avatar-group-outside-plugin'}
							role="region"
							aria-label={props.intl.formatMessage(messages.pageActionsLabel)}
						>
							{shouldSplitToolbar ? nonCustomToolbar : customToolbar}
						</div>
					</div>
				</ToolbarArrowKeyNavigationProvider>
			)}
		</ContextPanelConsumer>
	);
});

export const FullPageToolbar = injectIntl(EditorToolbar);
