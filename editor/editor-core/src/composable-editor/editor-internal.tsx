/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, memo, type MemoExoticComponent } from 'react';

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
import type { Transformer } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type EditorActions from '../actions';
import ErrorBoundary from '../create-editor/ErrorBoundary';
import ReactEditorViewNext from '../create-editor/ReactEditorView';
import { type EditorAppearanceComponentProps } from '../types';
import type { EditorNextProps } from '../types/editor-props';
import EditorContext from '../ui/EditorContext';
import { IntlProviderIfMissingWrapper } from '../ui/IntlProviderIfMissingWrapper/IntlProviderIfMissingWrapper';
import { createFeatureFlagsFromProps } from '../utils/feature-flags-from-props';
import { RenderTracking } from '../utils/performance/components/RenderTracking';

import { BaseThemeWrapper } from './BaseThemeWrapper';
import { getBaseFontSize } from './utils/getBaseFontSize';

interface InternalProps {
	AppearanceComponent: React.ComponentType<
		React.PropsWithChildren<EditorAppearanceComponentProps<[]>>
	>;
	createAnalyticsEvent: CreateUIAnalyticsEvent;
	editorActions: EditorActions;
	handleAnalyticsEvent: FireAnalyticsCallback;
	handleSave: (view: EditorView) => void;
	onEditorCreated: (instance: {
		eventDispatcher: EventDispatcher;
		transformer?: Transformer<string>;
		view: EditorView;
	}) => void;
	onEditorDestroyed: (_instance: { transformer?: Transformer<string>; view: EditorView }) => void;
	preset: EditorPresetBuilder<string[], AllEditorPresetPluginTypes[]>;
	props: EditorNextProps;
	providerFactory: ProviderFactory;
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
export const EditorInternal: MemoExoticComponent<(props: InternalProps) => JSX.Element> = memo(
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
		// Also firing too many events for the legacy content macro, so disabling for now. See - https://product-fabric.atlassian.net/browse/ED-26650
		const renderTrackingEnabled =
			!fg('platform_editor_disable_rerender_tracking_jira') &&
			!featureFlags.lcmPreventRenderTracking;

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
					<div
						css={editorContainerStyles}
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...(expValEquals('cc_fix_hydration_ttvc', 'isEnabled', true)
							? { 'data-vc-ignore-if-no-layout-shift': true }
							: {})}
					>
						<EditorContext editorActions={editorActions}>
							<IntlProviderIfMissingWrapper>
								<Fragment>
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
											<BaseThemeWrapper
												baseFontSize={getBaseFontSize(props.appearance, props.contentMode)}
											>
												<AppearanceComponent
													innerRef={editorRef}
													editorAPI={editorAPI}
													// Ignored via go/ees005
													// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
													contentMode={props.contentMode}
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
													__livePage={props.__livePage}
													preset={preset}
												/>
											</BaseThemeWrapper>
										)}
									/>
									<PortalRenderer />
									<NodeViewPortalRenderer />
								</Fragment>
							</IntlProviderIfMissingWrapper>
						</EditorContext>
					</div>
				</ErrorBoundary>
			</Fragment>
		);
	},
);
