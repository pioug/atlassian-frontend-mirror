/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, memo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type { FireAnalyticsCallback } from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { usePortalProvider } from '@atlaskit/editor-common/portal';
import type {
	AllEditorPresetPluginTypes,
	EditorPresetBuilder,
} from '@atlaskit/editor-common/preset';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { OptionalPlugin, PublicPluginAPI, Transformer } from '@atlaskit/editor-common/types';
import type { CardPlugin } from '@atlaskit/editor-plugins/card';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugins/context-identifier';
import { type CustomAutoformatPlugin } from '@atlaskit/editor-plugins/custom-autoformat';
import { type EmojiPlugin } from '@atlaskit/editor-plugins/emoji';
import type { MediaPlugin } from '@atlaskit/editor-plugins/media';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type EditorActions from '../actions';
import ErrorBoundary from '../create-editor/ErrorBoundary';
import { createFeatureFlagsFromProps } from '../create-editor/feature-flags-from-props';
import type { EditorViewProps } from '../create-editor/ReactEditorView';
import ReactEditorView from '../create-editor/ReactEditorView';
import ReactEditorViewNext from '../create-editor/ReactEditorViewNext';
import { ContextAdapter } from '../nodeviews/context-adapter';
import { type EditorAppearanceComponentProps } from '../types';
import type { EditorNextProps, EditorProps } from '../types/editor-props';
import EditorContext from '../ui/EditorContext';
import { IntlProviderIfMissingWrapper } from '../ui/IntlProviderIfMissingWrapper/IntlProviderIfMissingWrapper';
import { RenderTracking } from '../utils/performance/components/RenderTracking';

import { BaseThemeWrapper } from './BaseThemeWrapper';
import { useProviders } from './hooks/useProviders';
import { getBaseFontSize } from './utils/getBaseFontSize';

interface InternalProps {
	props: EditorNextProps;
	handleAnalyticsEvent: FireAnalyticsCallback;
	createAnalyticsEvent: CreateUIAnalyticsEvent;
	handleSave: (view: EditorView) => void;
	editorActions: EditorActions;
	onEditorCreated: (instance: {
		view: EditorView;
		eventDispatcher: EventDispatcher;
		transformer?: Transformer<string>;
	}) => void;
	onEditorDestroyed: (_instance: { view: EditorView; transformer?: Transformer<string> }) => void;
	preset: EditorPresetBuilder<string[], AllEditorPresetPluginTypes[]>;
	providerFactory: ProviderFactory;
	AppearanceComponent: React.ComponentType<
		React.PropsWithChildren<EditorAppearanceComponentProps<[]>>
	>;
}

const editorContainerStyles = css({
	position: 'relative',
	width: '100%',
	height: '100%',
});

/**
 * EditorInternalComponent is used to capture the common component
 * from the `render` method of `Editor` and share it with `EditorNext`.
 */
export const EditorInternal = memo(
	({
		props,
		handleAnalyticsEvent,
		createAnalyticsEvent,
		handleSave,
		editorActions,
		providerFactory,
		onEditorCreated,
		onEditorDestroyed,
		preset,
		AppearanceComponent,
	}: InternalProps) => {
		const overriddenEditorProps = {
			...props,
			onSave: props.onSave ? handleSave : undefined,
			// noop all analytic events, even if a handler is still passed.
			analyticsHandler: undefined,
		};

		const featureFlags = createFeatureFlagsFromProps(props.featureFlags);

		// Render tracking is firing too many events in Jira so we are disabling them for now. See - https://product-fabric.atlassian.net/browse/ED-25616
		const renderTrackingEnabled = !fg('platform_editor_disable_rerender_tracking_jira');
		const useShallow = false;
		const [portalProviderAPI, PortalRenderer] = usePortalProvider();
		const [nodeViewPortalProviderAPI, NodeViewPortalRenderer] = usePortalProvider();

		return (
			<Fragment>
				{renderTrackingEnabled && (
					<RenderTracking
						componentProps={props}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.EDITOR}
						handleAnalyticsEvent={handleAnalyticsEvent}
						propsToIgnore={['defaultValue']}
						useShallow={useShallow}
					/>
				)}
				<ErrorBoundary
					errorTracking={true}
					createAnalyticsEvent={createAnalyticsEvent}
					contextIdentifierProvider={props.contextIdentifierProvider}
					featureFlags={featureFlags}
				>
					<div css={editorContainerStyles}>
						<EditorContext editorActions={editorActions}>
							<ContextAdapter>
								<IntlProviderIfMissingWrapper>
									<Fragment>
										{fg('platform_editor_react_editor_view_react_18') ? (
											<ReactEditorViewNext
												editorProps={overriddenEditorProps}
												createAnalyticsEvent={createAnalyticsEvent}
												portalProviderAPI={portalProviderAPI}
												nodeViewPortalProviderAPI={nodeViewPortalProviderAPI}
												providerFactory={providerFactory}
												onEditorCreated={onEditorCreated}
												onEditorDestroyed={onEditorDestroyed}
												disabled={props.disabled}
												preset={preset}
												render={({
													editor,
													view,
													eventDispatcher,
													config,
													dispatchAnalyticsEvent,
													editorRef,
													editorAPI,
												}) => (
													<BaseThemeWrapper baseFontSize={getBaseFontSize(props.appearance)}>
														<AppearanceComponent
															innerRef={editorRef}
															editorAPI={editorAPI}
															appearance={props.appearance!}
															disabled={props.disabled}
															editorActions={editorActions}
															editorDOMElement={editor}
															editorView={view}
															providerFactory={providerFactory}
															eventDispatcher={eventDispatcher}
															dispatchAnalyticsEvent={dispatchAnalyticsEvent}
															maxHeight={props.maxHeight}
															minHeight={props.minHeight}
															onSave={props.onSave ? handleSave : undefined}
															onCancel={props.onCancel}
															popupsMountPoint={props.popupsMountPoint}
															popupsBoundariesElement={props.popupsBoundariesElement}
															popupsScrollableElement={props.popupsScrollableElement}
															contentComponents={config.contentComponents}
															primaryToolbarComponents={config.primaryToolbarComponents}
															primaryToolbarIconBefore={props.primaryToolbarIconBefore}
															secondaryToolbarComponents={config.secondaryToolbarComponents}
															customContentComponents={props.contentComponents}
															customPrimaryToolbarComponents={props.primaryToolbarComponents}
															customSecondaryToolbarComponents={props.secondaryToolbarComponents}
															contextPanel={props.contextPanel}
															collabEdit={props.collabEdit}
															persistScrollGutter={props.persistScrollGutter}
															enableToolbarMinWidth={
																props.featureFlags?.toolbarMinWidthOverflow != null
																	? !!props.featureFlags?.toolbarMinWidthOverflow
																	: props.allowUndoRedoButtons
															}
															useStickyToolbar={props.useStickyToolbar}
															featureFlags={featureFlags}
															pluginHooks={config.pluginHooks}
														/>
													</BaseThemeWrapper>
												)}
											/>
										) : (
											<ReactEditorViewContextWrapper
												editorProps={overriddenEditorProps}
												createAnalyticsEvent={createAnalyticsEvent}
												portalProviderAPI={portalProviderAPI}
												nodeViewPortalProviderAPI={nodeViewPortalProviderAPI}
												providerFactory={providerFactory}
												onEditorCreated={onEditorCreated}
												onEditorDestroyed={onEditorDestroyed}
												disabled={props.disabled}
												preset={preset}
												render={({
													editor,
													view,
													eventDispatcher,
													config,
													dispatchAnalyticsEvent,
													editorRef,
													editorAPI,
												}) => (
													<BaseThemeWrapper baseFontSize={getBaseFontSize(props.appearance)}>
														<AppearanceComponent
															innerRef={editorRef}
															editorAPI={editorAPI}
															appearance={props.appearance!}
															disabled={props.disabled}
															editorActions={editorActions}
															editorDOMElement={editor}
															editorView={view}
															providerFactory={providerFactory}
															eventDispatcher={eventDispatcher}
															dispatchAnalyticsEvent={dispatchAnalyticsEvent}
															maxHeight={props.maxHeight}
															minHeight={props.minHeight}
															onSave={props.onSave ? handleSave : undefined}
															onCancel={props.onCancel}
															popupsMountPoint={props.popupsMountPoint}
															popupsBoundariesElement={props.popupsBoundariesElement}
															popupsScrollableElement={props.popupsScrollableElement}
															contentComponents={config.contentComponents}
															primaryToolbarComponents={config.primaryToolbarComponents}
															primaryToolbarIconBefore={props.primaryToolbarIconBefore}
															secondaryToolbarComponents={config.secondaryToolbarComponents}
															customContentComponents={props.contentComponents}
															customPrimaryToolbarComponents={props.primaryToolbarComponents}
															customSecondaryToolbarComponents={props.secondaryToolbarComponents}
															contextPanel={props.contextPanel}
															collabEdit={props.collabEdit}
															persistScrollGutter={props.persistScrollGutter}
															enableToolbarMinWidth={
																props.featureFlags?.toolbarMinWidthOverflow != null
																	? !!props.featureFlags?.toolbarMinWidthOverflow
																	: props.allowUndoRedoButtons
															}
															useStickyToolbar={props.useStickyToolbar}
															featureFlags={featureFlags}
															pluginHooks={config.pluginHooks}
														/>
													</BaseThemeWrapper>
												)}
											/>
										)}
										<PortalRenderer />
										<NodeViewPortalRenderer />
									</Fragment>
								</IntlProviderIfMissingWrapper>
							</ContextAdapter>
						</EditorContext>
					</div>
				</ErrorBoundary>
			</Fragment>
		);
	},
);

type ReactEditorViewPlugins = [
	OptionalPlugin<ContextIdentifierPlugin>,
	OptionalPlugin<MediaPlugin>,
	OptionalPlugin<CardPlugin>,
	OptionalPlugin<EmojiPlugin>,
	OptionalPlugin<CustomAutoformatPlugin>,
];

type ReactEditorViewContextWrapperProps = Omit<EditorViewProps, 'editorAPI'>;

function ReactEditorViewContextWrapper(props: ReactEditorViewContextWrapperProps) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [editorAPI, setEditorAPI] = useState<PublicPluginAPI<any> | undefined>(undefined);

	// TODO: Remove these when we deprecate these props from editor-props - smartLinks is unfortunately still used in some places, we can sidestep this problem if we move everyone across to ComposableEditor and deprecate Editor
	const UNSAFE_cards = (props.editorProps as EditorProps).UNSAFE_cards;
	const smartLinks = (props.editorProps as EditorProps).smartLinks;

	useProviders({
		editorApi: editorAPI as PublicPluginAPI<ReactEditorViewPlugins>,
		contextIdentifierProvider: props.editorProps.contextIdentifierProvider,
		mediaProvider: (props.editorProps as EditorProps).media?.provider,
		cardProvider:
			(props.editorProps as EditorProps).linking?.smartLinks?.provider ||
			(smartLinks && smartLinks.provider) ||
			(UNSAFE_cards && UNSAFE_cards.provider),
		emojiProvider: props.editorProps.emojiProvider,
		autoformattingProvider: props.editorProps.autoformattingProvider,
		taskDecisionProvider: props.editorProps.taskDecisionProvider,
	});

	return <ReactEditorView {...props} editorAPI={editorAPI} setEditorAPI={setEditorAPI} />;
}
