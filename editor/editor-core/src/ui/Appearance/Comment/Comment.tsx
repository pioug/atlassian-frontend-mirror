/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import classnames from 'classnames';
import { useIntl } from 'react-intl-next';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import {
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import messages from '@atlaskit/editor-common/messages';
import type { EditorAppearance, OptionalPlugin } from '@atlaskit/editor-common/types';
import { WidthConsumer, WidthProvider } from '@atlaskit/editor-common/ui';
import { ToolbarArrowKeyNavigationProvider } from '@atlaskit/editor-common/ui-menu';
import type { MaxContentSizePlugin } from '@atlaskit/editor-plugins/max-content-size';
import type { MediaPlugin } from '@atlaskit/editor-plugins/media';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugins/primary-toolbar';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';
import { akEditorMobileBreakoutPoint } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import type { EditorAppearanceComponentProps } from '../../../types';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import ClickAreaBlock from '../../Addon/ClickAreaBlock';
import { contentComponentClickWrapper } from '../../Addon/ClickAreaBlock/contentComponentWrapper';
import EditorContentContainer from '../../EditorContentContainer/EditorContentContainer';
import PluginSlot from '../../PluginSlot';
import { getPrimaryToolbarComponents } from '../../Toolbar/getPrimaryToolbarComponents';
import { ToolbarWithSizeDetector as Toolbar } from '../../Toolbar/ToolbarWithSizeDetector';
import WithFlash from '../../WithFlash';

import { CommentToolbar } from './CommentToolbar';
import { MainToolbar } from './Toolbar';

const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 490;

const commentEditorStyles = css({
	display: 'flex',
	flexDirection: 'column',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.less-margin > .ProseMirror': {
		margin: `${token('space.150', '12px')} ${token('space.100', '8px')} ${token(
			'space.100',
			'8px',
		)}`,
	},
	minWidth: '272px',
	height: 'auto',
	backgroundColor: token('color.background.input', 'white'),
	border: `${token('border.width')} solid ${token('color.border.input')}`,
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: token('radius.small', '3px'),
	maxWidth: 'inherit',
	wordWrap: 'break-word',
});

const secondaryToolbarStyles = css({
	boxSizing: 'border-box',
	justifyContent: 'flex-end',
	alignItems: 'center',
	display: 'flex',
	padding: `${token('space.150', '12px')} ${token('space.025', '2px')}`,
});

const mainToolbarCustomComponentsSlotStyleNew = css({
	display: 'flex',
	justifyContent: 'flex-end',
	alignItems: 'center',
	flexGrow: 1,
	paddingRight: token('space.250', '20px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'> div': {
		display: 'flex',
		flexShrink: 0,
	},
});

const mainToolbarCustomComponentsSlotStylePaddingOverride = css({
	paddingRight: 0,
});

const mainToolbarCustomComponentsSlotStyleTwoLineToolbarNew = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	[`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
		paddingRight: 0,
	},
});

const appearance: EditorAppearance = 'comment';

type ComponentProps = EditorAppearanceComponentProps<
	[
		OptionalPlugin<MediaPlugin>,
		OptionalPlugin<MaxContentSizePlugin>,
		OptionalPlugin<PrimaryToolbarPlugin>,
		OptionalPlugin<ToolbarPlugin>,
	]
>;

export const CommentEditorWithIntl = (props: ComponentProps) => {
	const { editorAPI } = props;

	const { editorViewMode, primaryToolbarComponentsState, maxContentSizeReached } =
		useSharedPluginStateWithSelector(
			editorAPI,
			['maxContentSize', 'primaryToolbar', 'editorViewMode'],
			(states) => ({
				maxContentSizeReached: !!states.maxContentSizeState?.maxContentSizeReached,
				primaryToolbarComponentsState: states.primaryToolbarState?.components,
				editorViewMode: states.editorViewModeState?.mode,
			}),
		);

	const primaryToolbarState = getPrimaryToolbarComponents(editorAPI, primaryToolbarComponentsState);
	const { mediaState } = useSharedPluginState(editorAPI, ['media']);
	const intl = useIntl();
	const {
		editorDOMElement,
		editorView,
		editorActions,
		eventDispatcher,
		providerFactory,
		contentComponents,
		customContentComponents,
		customPrimaryToolbarComponents,
		primaryToolbarComponents: primaryToolbarComponentsProp,
		customSecondaryToolbarComponents,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		maxHeight,
		minHeight = 150,
		onSave,
		onCancel,
		disabled,
		dispatchAnalyticsEvent,
		useStickyToolbar,
		pluginHooks,
		featureFlags,
		innerRef,
	} = props;

	const showSecondaryToolbar = !!onSave || !!onCancel || !!customSecondaryToolbarComponents;
	const containerElement = React.useRef<HTMLDivElement>(null);

	// Wrapper container for toolbar and content area
	const wrapperElementRef = useMemo(
		() => innerRef || React.createRef<HTMLDivElement>(),
		[innerRef],
	);

	const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

	useEffect(() => {
		if (mediaState) {
			mediaState.subscribeToUploadInProgressState(setSaveButtonDisabled);
		}
		return () => mediaState?.unsubscribeFromUploadInProgressState(setSaveButtonDisabled);
	}, [mediaState]);

	const handleSave = useCallback(() => {
		if (editorView && onSave) {
			onSave(editorView);
		}
	}, [editorView, onSave]);

	const handleCancel = useCallback(() => {
		if (editorView && onCancel) {
			onCancel(editorView);
		}
	}, [editorView, onCancel]);

	const isShortcutToFocusToolbar = useCallback((event: KeyboardEvent) => {
		//Alt + F9 to reach first element in this main toolbar
		return event.altKey && (event.key === 'F9' || event.keyCode === 120);
	}, []);

	// When primary toolbar components is undefined, do not show two line editor toolbar
	const isTwoLineToolbarEnabled = !!customPrimaryToolbarComponents;

	const handleEscape = useCallback(
		(event: KeyboardEvent) => {
			if (!editorView?.hasFocus()) {
				editorView?.focus();
			}
			event.preventDefault();
			event.stopPropagation();
		},
		[editorView],
	);

	let primaryToolbarComponents = primaryToolbarComponentsProp;
	if (Array.isArray(primaryToolbarState?.components) && Array.isArray(primaryToolbarComponents)) {
		primaryToolbarComponents = primaryToolbarState.components.concat(primaryToolbarComponents);
	}
	const isToolbarAIFCEnabled = Boolean(editorAPI?.toolbar);
	const customToolbarSlot = (
		<div
			css={[
				mainToolbarCustomComponentsSlotStyleNew,
				isTwoLineToolbarEnabled && mainToolbarCustomComponentsSlotStyleTwoLineToolbarNew,
				isToolbarAIFCEnabled && mainToolbarCustomComponentsSlotStylePaddingOverride,
			]}
		>
			{customPrimaryToolbarComponents as React.ReactNode}
		</div>
	);

	return (
		<WithFlash animate={maxContentSizeReached}>
			<WidthProvider>
				<div
					css={[
						commentEditorStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						css({
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
							minHeight: `${minHeight}px`,
						}),
					]}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="akEditor"
					ref={wrapperElementRef}
				>
					<MainToolbar
						useStickyToolbar={useStickyToolbar}
						twoLineEditorToolbar={isTwoLineToolbarEnabled}
						isNewToolbarEnabled={isToolbarAIFCEnabled}
					>
						{isToolbarAIFCEnabled ? (
							<ToolbarArrowKeyNavigationProvider
								editorView={editorView}
								childComponentSelector={"[data-testid='ak-editor-main-toolbar']"}
								isShortcutToFocusToolbar={isShortcutToFocusToolbar}
								handleEscape={handleEscape}
								editorAppearance={appearance}
								useStickyToolbar={useStickyToolbar}
								intl={intl}
							>
								<CommentToolbar
									editorAPI={editorAPI}
									editorView={editorView}
									editorAppearance={appearance}
									disabled={!!disabled}
									popupsBoundariesElement={popupsBoundariesElement}
									popupsScrollableElement={popupsScrollableElement}
									popupsMountPoint={popupsMountPoint}
								/>
								{customPrimaryToolbarComponents ? customToolbarSlot : null}
							</ToolbarArrowKeyNavigationProvider>
						) : (
							<ToolbarArrowKeyNavigationProvider
								editorView={editorView}
								childComponentSelector={"[data-testid='ak-editor-main-toolbar']"}
								isShortcutToFocusToolbar={isShortcutToFocusToolbar}
								handleEscape={handleEscape}
								editorAppearance={appearance}
								useStickyToolbar={useStickyToolbar}
								intl={intl}
							>
								<Toolbar
									// Ignored via go/ees005
									// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
									editorView={editorView!}
									editorActions={editorActions}
									// Ignored via go/ees005
									// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
									eventDispatcher={eventDispatcher!}
									// Ignored via go/ees005
									// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
									providerFactory={providerFactory!}
									appearance={appearance}
									items={primaryToolbarComponents}
									popupsMountPoint={popupsMountPoint}
									popupsBoundariesElement={popupsBoundariesElement}
									popupsScrollableElement={popupsScrollableElement}
									disabled={!!disabled}
									dispatchAnalyticsEvent={dispatchAnalyticsEvent}
									containerElement={containerElement.current}
									twoLineEditorToolbar={isTwoLineToolbarEnabled}
								/>
								{customToolbarSlot}
							</ToolbarArrowKeyNavigationProvider>
						)}
					</MainToolbar>
					<ClickAreaBlock editorView={editorView} editorDisabled={disabled}>
						<WidthConsumer>
							{({ width }) => {
								return (
									<EditorContentContainer
										ref={containerElement}
										css={[
											maxHeight
												? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
													css({
														// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
														maxHeight: `${maxHeight}px`,
														// When maxHeight is set, content area should have overflow-y explicitly set as auto
														// As we have overflow-x: clip for the content area, and when maxHeight prop is set, overflow-y will be computed as visible by default.
														// This will cause the content area to have content overflowing the container
														// so need to set overflow-y as auto to make sure the content area is scrollable
														overflowY: 'auto',
													})
												: null,
										]}
										isScrollable={maxHeight ? true : undefined}
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
										className={classnames('ak-editor-content-area', {
											'less-margin': width < akEditorMobileBreakoutPoint,
										})}
										featureFlags={featureFlags}
										viewMode={editorViewMode}
										appearance={appearance}
									>
										{customContentComponents && 'before' in customContentComponents
											? contentComponentClickWrapper(customContentComponents.before)
											: contentComponentClickWrapper(customContentComponents)}
										<PluginSlot
											editorView={editorView}
											editorActions={editorActions}
											eventDispatcher={eventDispatcher}
											dispatchAnalyticsEvent={dispatchAnalyticsEvent}
											providerFactory={providerFactory}
											appearance={appearance}
											items={contentComponents}
											popupsMountPoint={popupsMountPoint}
											popupsBoundariesElement={popupsBoundariesElement}
											popupsScrollableElement={popupsScrollableElement}
											containerElement={containerElement.current}
											disabled={!!disabled}
											wrapperElement={wrapperElementRef.current}
											pluginHooks={pluginHooks}
										/>
										{editorDOMElement}
										{customContentComponents && 'after' in customContentComponents
											? contentComponentClickWrapper(customContentComponents.after)
											: null}
									</EditorContentContainer>
								);
							}}
						</WidthConsumer>
					</ClickAreaBlock>
				</div>

				{showSecondaryToolbar && (
					<div css={secondaryToolbarStyles} data-testid="ak-editor-secondary-toolbar">
						<ButtonGroup>
							{!!onSave && (
								<Button
									appearance="primary"
									onClick={handleSave}
									testId="comment-save-button"
									isDisabled={disabled || saveButtonDisabled}
									interactionName="editor-comment-save-button"
								>
									{intl.formatMessage(messages.saveButton)}
								</Button>
							)}
							{!!onCancel && (
								<Button
									appearance="subtle"
									onClick={handleCancel}
									testId="comment-cancel-button"
									isDisabled={disabled}
									interactionName="editor-comment-cancel-button"
								>
									{intl.formatMessage(messages.cancelButton)}
								</Button>
							)}
						</ButtonGroup>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<span style={{ flexGrow: 1 }} />
						{customSecondaryToolbarComponents}
					</div>
				)}
			</WidthProvider>
		</WithFlash>
	);
};

CommentEditorWithIntl.displayName = 'CommentEditorAppearance';
