import type { ReactElement } from 'react';
import React, { useEffect, useCallback, useState } from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

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
import type { PrimaryToolbarComponents } from '../../../types/editor-props';
import { ToolbarPortalMountPoint, useToolbarPortal } from '../../Toolbar/ToolbarPortal';
import { ToolbarWithSizeDetector as Toolbar } from '../../Toolbar/ToolbarWithSizeDetector';

import { BeforePrimaryToolbarWrapper } from './BeforeWrapper';
import {
	MainToolbarForFirstChildWrapper,
	MainToolbarForSecondChildWrapper,
} from './CustomToolbarWrapper';
import { CustomToolbarWrapperMigration } from './CustomToolbarWrapperMigration';
import { MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT } from './MainToolbar';
import { MainToolbarIconBeforeMigration } from './MainToolbarIconBeforeMigration';
import { MainToolbarWrapper } from './MainToolbarWrapper';
import { NonCustomToolbarWrapperMigration } from './NonCustomToolbarWrapperMigration';

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
	beforeIcon?: ReactElement;
	collabEdit?: CollabEditOptions;
	containerElement: HTMLElement | null;
	customPrimaryToolbarComponents?: PrimaryToolbarComponents;
	disabled: boolean;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorActions?: EditorActions;
	editorAPI: PublicPluginAPI<ToolbarEditorPlugins> | undefined;
	editorDOMElement: JSX.Element;
	editorView: EditorView;
	eventDispatcher: EventDispatcher;
	featureFlags: FeatureFlags;
	hasMinWidth?: boolean;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	primaryToolbarComponents?: ToolbarUIComponentFactory[];
	providerFactory: ProviderFactory;
	showKeyline: boolean;
}

export const EditorToolbar: React.MemoExoticComponent<
	(props: FullPageToolbarProps & WrappedComponentProps) => React.JSX.Element
> = React.memo((props: FullPageToolbarProps & WrappedComponentProps): React.JSX.Element => {
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
		<NonCustomToolbarWrapperMigration>
			{props.beforeIcon && (
				<MainToolbarIconBeforeMigration>{props.beforeIcon}</MainToolbarIconBeforeMigration>
			)}
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
		</NonCustomToolbarWrapperMigration>
	);

	const customToolbar = (
		<CustomToolbarWrapperMigration>
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
		</CustomToolbarWrapperMigration>
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

	const isShortcutToFocusToolbar = useCallback((event: KeyboardEvent) => {
		//Alt + F9 to reach first element in this main toolbar
		return event.altKey && (event.key === 'F9' || event.keyCode === 120);
	}, []);

	const handleEscape = useCallback(
		(event: KeyboardEvent) => {
			if (!props.editorView?.hasFocus()) {
				props.editorView?.focus();
			}
			event.preventDefault();
			event.stopPropagation();
		},
		[props.editorView],
	);

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

// eslint-disable-next-line @typescript-eslint/ban-types
export const FullPageToolbar: React.FC<
	WithIntlProps<FullPageToolbarProps & WrappedComponentProps>
> & {
	WrappedComponent: React.ComponentType<FullPageToolbarProps & WrappedComponentProps>;
} = injectIntl(EditorToolbar);
