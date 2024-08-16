/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, memo, useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { FireAnalyticsCallback } from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import { usePortalProvider } from '@atlaskit/editor-common/portal';
import type {
	AllEditorPresetPluginTypes,
	EditorPresetBuilder,
} from '@atlaskit/editor-common/preset';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { PublicPluginAPI, Transformer } from '@atlaskit/editor-common/types';
import { BaseTheme, IntlProviderIfMissingWrapper, WidthProvider } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type EditorActions from '../actions';
import { getUiComponent } from '../create-editor';
import ErrorBoundary from '../create-editor/ErrorBoundary';
import { createFeatureFlagsFromProps } from '../create-editor/feature-flags-from-props';
import type { EditorViewProps } from '../create-editor/ReactEditorView';
import ReactEditorView from '../create-editor/ReactEditorView';
import type { EventDispatcher } from '../event-dispatcher';
import { ContextAdapter } from '../nodeviews/context-adapter';
import { useSetPresetContext } from '../presets/context';
import type { EditorNextProps } from '../types/editor-props';
import EditorContext from '../ui/EditorContext';
import { RenderTracking } from '../utils/performance/components/RenderTracking';

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
}

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
	}: InternalProps) => {
		const Component = getUiComponent(props.appearance!);

		const setEditorApi = useCallback(
			(api: PublicPluginAPI<any>) => {
				// This is an workaround to unblock Editor Lego Decoupling project, if you have questions ping us #cc-editor-lego
				// We may clean up this code when EditorActions deprecation process starts
				// @ts-expect-error 2339: Property '__EDITOR_INTERNALS_DO_NOT_USE__API' does not exist on type 'EditorActions<any>'.
				editorActions.__EDITOR_INTERNALS_DO_NOT_USE__API = api;
			},
			[editorActions],
		);

		const overriddenEditorProps = {
			...props,
			onSave: props.onSave ? handleSave : undefined,
			// noop all analytic events, even if a handler is still passed.
			analyticsHandler: undefined,
		};

		const featureFlags = createFeatureFlagsFromProps(props);
		const renderTracking = props.performanceTracking?.renderTracking?.editor;
		const renderTrackingEnabled = renderTracking?.enabled;
		const useShallow = renderTracking?.useShallow;
		const [portalProviderAPI, PortalRenderer] = usePortalProvider();

		// ED-16320: Check for explicit disable so that by default
		// it will still be enabled as it currently is. Then we can
		// progressively opt out synthetic tenants.
		const isErrorTrackingExplicitlyDisabled =
			props.performanceTracking?.errorTracking?.enabled === false;

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
					errorTracking={!isErrorTrackingExplicitlyDisabled}
					createAnalyticsEvent={createAnalyticsEvent}
					contextIdentifierProvider={props.contextIdentifierProvider}
					featureFlags={featureFlags}
				>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<WidthProvider css={css({ height: '100%' })}>
						<EditorContext editorActions={editorActions}>
							<ContextAdapter>
								<IntlProviderIfMissingWrapper>
									<Fragment>
										<ReactEditorViewContextWrapper
											editorProps={overriddenEditorProps}
											createAnalyticsEvent={createAnalyticsEvent}
											portalProviderAPI={portalProviderAPI}
											providerFactory={providerFactory}
											onEditorCreated={onEditorCreated}
											onEditorDestroyed={onEditorDestroyed}
											disabled={props.disabled}
											preset={preset}
											setEditorApi={setEditorApi}
											render={({
												editor,
												view,
												eventDispatcher,
												config,
												dispatchAnalyticsEvent,
												editorRef,
												editorAPI,
											}) => (
												<BaseTheme baseFontSize={getBaseFontSize(props.appearance)}>
													<Component
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
														hideAvatarGroup={props.hideAvatarGroup}
													/>
												</BaseTheme>
											)}
										/>
										<PortalRenderer />
									</Fragment>
								</IntlProviderIfMissingWrapper>
							</ContextAdapter>
						</EditorContext>
					</WidthProvider>
				</ErrorBoundary>
			</Fragment>
		);
	},
);

function ReactEditorViewContextWrapper(props: EditorViewProps) {
	const setInternalEditorAPI = useSetPresetContext();
	const { setEditorApi: setExternalEditorAPI } = props;

	/**
	 * We use the context to retrieve the editorAPI
	 * externally for consumers via `usePreset`.
	 *
	 * However we also may need to retrieve this value internally via context
	 * so we should also set the value for the `EditorContext` that is used in
	 * `EditorInternal`.
	 */
	const setEditorAPI = useCallback(
		(api: PublicPluginAPI<any>) => {
			setInternalEditorAPI?.(api);
			setExternalEditorAPI?.(api);
		},
		[setInternalEditorAPI, setExternalEditorAPI],
	);

	useProviders({
		contextIdentifierProvider: props.editorProps.contextIdentifierProvider,
		mediaProvider: props.editorProps.media?.provider,
	});

	return <ReactEditorView {...props} setEditorApi={setEditorAPI} />;
}
