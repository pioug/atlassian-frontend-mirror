/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactElement } from 'react';
import React, { useImperativeHandle, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, useTheme, type Theme } from '@emotion/react';
import classnames from 'classnames';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { fullPageMessages as messages } from '@atlaskit/editor-common/messages';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
	EditorAppearance,
	FeatureFlags,
	OptionalPlugin,
	PublicPluginAPI,
	ReactHookFactory,
	UIComponentFactory,
} from '@atlaskit/editor-common/types';
import { type ContextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
import { type ViewMode } from '@atlaskit/editor-plugins/editor-viewmode';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { scrollbarStyles } from '@atlaskit/editor-shared-styles/scrollbar';
import { fg } from '@atlaskit/platform-feature-flags';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type EditorActions from '../../../actions';
import type { ContentComponents, ReactComponents } from '../../../types';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import ClickAreaBlock from '../../Addon/ClickAreaBlock';
import { contentComponentClickWrapper } from '../../Addon/ClickAreaBlock/contentComponentWrapper';
import { createEditorContentStyle } from '../../ContentStyles';
import { ContextPanel } from '../../ContextPanel';
import EditorContentContainer from '../../EditorContentContainer/EditorContentContainer';
import PluginSlot from '../../PluginSlot';

import {
	contentArea,
	contentAreaHeightNoToolbar,
	contentAreaWrapper,
	editorContentAreaStyle,
	editorContentGutterStyle,
	sidebarArea,
} from './StyledComponents';
import type { ScrollContainerRefs } from './types';

interface FullPageEditorContentAreaProps {
	editorAPI: PublicPluginAPI<[OptionalPlugin<ContextPanelPlugin>]> | undefined;
	appearance: EditorAppearance | undefined;
	contentComponents: UIComponentFactory[] | undefined;
	pluginHooks: ReactHookFactory[] | undefined;
	contextPanel: ReactComponents | undefined;
	customContentComponents: ContentComponents | undefined;
	disabled: boolean | undefined;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
	editorActions: EditorActions | undefined;
	editorDOMElement: ReactElement;
	editorView: EditorView;
	eventDispatcher: EventDispatcher | undefined;
	popupsMountPoint: HTMLElement | undefined;
	popupsBoundariesElement: HTMLElement | undefined;
	popupsScrollableElement: HTMLElement | undefined;
	providerFactory: ProviderFactory;
	wrapperElement: HTMLElement | null;
	hasHadInteraction?: boolean;
	featureFlags?: FeatureFlags;
	viewMode: ViewMode | undefined;
	isEditorToolbarHidden?: boolean;
}

export const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';
export const EDITOR_CONTAINER = 'ak-editor-container';

const scrollStyles = css(
	{
		flexGrow: 1,
		height: '100%',
		overflowY: 'scroll',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		scrollBehavior: 'smooth',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	scrollbarStyles,
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const ScrollContainer = createEditorContentStyle(scrollStyles);
ScrollContainer.displayName = 'ScrollContainer';

const EditorContainer = componentWithCondition(
	() => editorExperiment('platform_editor_core_static_emotion', true, { exposure: true }),
	EditorContentContainer,
	ScrollContainer,
);

const Content = React.forwardRef<
	ScrollContainerRefs,
	FullPageEditorContentAreaProps & WrappedComponentProps
>((props, ref) => {
	const theme: Theme = useTheme();
	const fullWidthMode = props.appearance === 'full-width';
	const scrollContainerRef = useRef(null);
	const contentAreaRef = useRef(null);
	const containerRef = useRef(null);

	useImperativeHandle(
		ref,
		() => ({
			get scrollContainer() {
				return scrollContainerRef.current;
			},
			get contentArea() {
				return contentAreaRef.current;
			},
			get containerArea() {
				return containerRef.current;
			},
		}),
		[],
	);

	// Remove entire `hasHadInteraction` logic and prop when 'platform_editor_interaction_api_refactor' is cleaned up
	let interactionClassName: string | undefined;
	if (fg('platform_editor_interaction_api_refactor')) {
		// no-op and do not add any classes
	} else if (
		// eslint-disable-next-line @atlaskit/platform/no-preconditioning
		props.hasHadInteraction !== undefined &&
		fg('platform_editor_no_cursor_on_live_doc_init')
	) {
		interactionClassName = props.hasHadInteraction
			? 'ak-editor-has-interaction'
			: 'ak-editor-no-interaction';
	}

	const shouldSetHiddenDataAttribute = () => {
		// When platform_editor_offline_banner_toolbar_position is enabled we use a different method to
		// determine if the toolbar is hidden from outside of the editor, which doesn't require setting
		// data-editor-primary-toolbar-hidden on the content area
		// NOTE: When tidying, this function and the data attribute can be removed
		if (!props.isEditorToolbarHidden || fg('platform_editor_offline_banner_toolbar_position')) {
			return false;
		}

		return editorExperiment('platform_editor_controls', 'variant1');
	};

	return (
		<div
			css={[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				contentArea,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				editorExperiment('live_pages_graceful_edit', 'control') &&
					props.isEditorToolbarHidden &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					contentAreaHeightNoToolbar,
			]}
			data-testid={CONTENT_AREA_TEST_ID}
			ref={containerRef}
			// eslint-disable-next-line  @atlaskit/ui-styling-standard/no-classname-prop
			className={
				!editorExperiment('live_pages_graceful_edit', 'control') && props.isEditorToolbarHidden
					? 'ak-editor-content-area-no-toolbar'
					: undefined
			}
		>
			<div
				css={
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					contentAreaWrapper
				}
				data-testid={EDITOR_CONTAINER}
				data-editor-container={'true'}
			>
				<EditorContainer
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="fabric-editor-popup-scroll-parent"
					featureFlags={props.featureFlags}
					ref={scrollContainerRef}
					viewMode={props?.viewMode}
					isScrollable
					appearance={props.appearance}
				>
					<ClickAreaBlock editorView={props.editorView} editorDisabled={props.disabled}>
						<div
							css={[
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
								...editorContentAreaStyle({
									fullWidthMode,
									layoutMaxWidth: theme.layoutMaxWidth,
									isEditorToolbarHidden: props.isEditorToolbarHidden,
								}),
							]}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
							className="ak-editor-content-area-region"
							data-editor-editable-content
							data-editor-primary-toolbar-hidden={
								shouldSetHiddenDataAttribute() ? 'true' : undefined
							}
							role="region"
							aria-label={props.intl.formatMessage(messages.editableContentLabel)}
							ref={contentAreaRef}
						>
							<div
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
								css={editorContentGutterStyle()}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={
									fg('platform_editor_no_cursor_on_live_doc_init')
										? classnames(
												'ak-editor-content-area',
												'appearance-full-page',
												interactionClassName,
												{
													'fabric-editor--full-width-mode': fullWidthMode,
												},
											)
										: [
												'ak-editor-content-area',
												'appearance-full-page',
												fullWidthMode ? 'fabric-editor--full-width-mode' : '',
											].join(' ')
								}
								ref={contentAreaRef}
							>
								{!!props.customContentComponents && 'before' in props.customContentComponents
									? contentComponentClickWrapper(props.customContentComponents.before)
									: contentComponentClickWrapper(props.customContentComponents)}
								<PluginSlot
									editorView={props.editorView}
									editorActions={props.editorActions}
									eventDispatcher={props.eventDispatcher}
									providerFactory={props.providerFactory}
									appearance={props.appearance}
									items={props.contentComponents}
									pluginHooks={props.pluginHooks}
									contentArea={contentAreaRef.current ?? undefined}
									popupsMountPoint={props.popupsMountPoint}
									popupsBoundariesElement={props.popupsBoundariesElement}
									popupsScrollableElement={props.popupsScrollableElement}
									disabled={!!props.disabled}
									containerElement={scrollContainerRef.current}
									dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
									wrapperElement={props.wrapperElement}
								/>
								{props.editorDOMElement}
								{!!props.customContentComponents && 'after' in props.customContentComponents
									? contentComponentClickWrapper(props.customContentComponents.after)
									: null}
							</div>
						</div>
					</ClickAreaBlock>
				</EditorContainer>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<div css={sidebarArea}>
				{props.contextPanel || <ContextPanel editorAPI={props.editorAPI} visible={false} />}
			</div>
		</div>
	);
});

export const FullPageContentArea = injectIntl(Content, { forwardRef: true });
