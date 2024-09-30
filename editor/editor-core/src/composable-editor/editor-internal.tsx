/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, memo, useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type { FireAnalyticsCallback } from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
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
import type { EventDispatcher } from '../event-dispatcher';
import { ContextAdapter } from '../nodeviews/context-adapter';
import { usePresetContext, useSetPresetContext } from '../presets/context';
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
					<div css={editorContainerStyles}>
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
										<PortalRenderer />
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
	// deprecated, unable to be FF due to hook usage
	const setInternalEditorAPI = useSetPresetContext();
	const presetContextEditorAPI = usePresetContext<ReactEditorViewPlugins>();

	// new way of storing the editorApi when FF platform_editor_remove_use_preset_context is enabled
	const [editorAPI, setEditorAPI] = useState<PublicPluginAPI<ReactEditorViewPlugins> | undefined>(
		undefined,
	);

	/**
	 * We use the context to retrieve the editorAPI
	 * externally for consumers via `usePreset`.
	 *
	 * However we also may need to retrieve this value internally via context
	 * so we should also set the value for the `EditorContext` that is used in
	 * `EditorInternal`.
	 */
	const setPresetContextEditorAPI = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(api: PublicPluginAPI<any>) => {
			if (fg('platform_editor_remove_use_preset_context')) {
				setEditorAPI(api as PublicPluginAPI<ReactEditorViewPlugins>);
			} else {
				setInternalEditorAPI?.(api);
			}
		},
		[setInternalEditorAPI, setEditorAPI],
	);

	// TODO: Remove these when we deprecate these props from editor-props - smartLinks is unfortunately still used in some places, we can sidestep this problem if we move everyone across to ComposableEditor and deprecate Editor
	const UNSAFE_cards = (props.editorProps as EditorProps).UNSAFE_cards;
	const smartLinks = (props.editorProps as EditorProps).smartLinks;

	useProviders({
		editorApi: fg('platform_editor_remove_use_preset_context') ? editorAPI : presetContextEditorAPI,
		contextIdentifierProvider: props.editorProps.contextIdentifierProvider,
		mediaProvider: (props.editorProps as EditorProps).media?.provider,
		cardProvider:
			(props.editorProps as EditorProps).linking?.smartLinks?.provider ||
			(smartLinks && smartLinks.provider) ||
			(UNSAFE_cards && UNSAFE_cards.provider),
		emojiProvider: props.editorProps.emojiProvider,
		autoformattingProvider: props.editorProps.autoformattingProvider,
	});

	return (
		<ReactEditorView {...props} editorAPI={editorAPI} setEditorApi={setPresetContextEditorAPI} />
	);
}
