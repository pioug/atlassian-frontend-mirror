/** @jsx jsx */
import type { ReactElement } from 'react';
import React, { useImperativeHandle, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, useTheme } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { fullPageMessages as messages } from '@atlaskit/editor-common/messages';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ReactHookFactory } from '@atlaskit/editor-common/types';
import { ContextPanelConsumer, WidthConsumer } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type EditorActions from '../../../actions';
import type { EventDispatcher } from '../../../event-dispatcher';
import type {
	ContentComponents,
	EditorAppearance,
	ReactComponents,
	UIComponentFactory,
} from '../../../types';
import type { FeatureFlags } from '../../../types/feature-flags';
import { ClickAreaBlock } from '../../Addon';
import ContextPanel from '../../ContextPanel';
import PluginSlot from '../../PluginSlot';

import {
	contentArea,
	contentAreaHeightNoToolbar,
	editorContentAreaStyle,
	editorContentGutterStyle,
	positionedOverEditorStyle,
	ScrollContainer,
	sidebarArea,
} from './StyledComponents';

interface FullPageEditorContentAreaProps {
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
	featureFlags?: FeatureFlags;
	isEditorToolbarHidden?: boolean;
}

export const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';

type ScrollContainerRefs = {
	scrollContainer: HTMLDivElement | null;
	contentArea: HTMLDivElement | null;
};

const Content = React.forwardRef<
	ScrollContainerRefs,
	FullPageEditorContentAreaProps & WrappedComponentProps
>((props, ref) => {
	const theme: { [index: string]: any } = useTheme();
	const fullWidthMode = props.appearance === 'full-width';
	const scrollContainerRef = useRef(null);
	const contentAreaRef = useRef(null);

	useImperativeHandle(
		ref,
		() => ({
			get scrollContainer() {
				return scrollContainerRef.current;
			},
			get contentArea() {
				return contentAreaRef.current;
			},
		}),
		[],
	);

	return (
		<WidthConsumer>
			{({ width }) => (
				<ContextPanelConsumer>
					{({ positionedOverEditor }) => (
						<div
							css={[
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
								contentArea,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
								props.isEditorToolbarHidden && contentAreaHeightNoToolbar,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
								positionedOverEditor && positionedOverEditorStyle,
							]}
							data-testid={CONTENT_AREA_TEST_ID}
						>
							<ScrollContainer
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className="fabric-editor-popup-scroll-parent"
								featureFlags={props.featureFlags}
								ref={scrollContainerRef}
							>
								<ClickAreaBlock editorView={props.editorView} editorDisabled={props.disabled}>
									<div
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
										css={editorContentAreaStyle({
											fullWidthMode,
											layoutMaxWidth: theme.layoutMaxWidth,
											containerWidth: width,
										})}
										role="region"
										aria-label={props.intl.formatMessage(messages.editableContentLabel)}
										ref={contentAreaRef}
									>
										<div
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
											css={editorContentGutterStyle}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
											className={[
												'ak-editor-content-area',
												fullWidthMode ? 'fabric-editor--full-width-mode' : '',
											].join(' ')}
											ref={contentAreaRef}
										>
											{!!props.customContentComponents && 'before' in props.customContentComponents
												? props.customContentComponents.before
												: props.customContentComponents}
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
												? props.customContentComponents.after
												: null}
										</div>
									</div>
								</ClickAreaBlock>
							</ScrollContainer>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<div css={sidebarArea}>{props.contextPanel || <ContextPanel visible={false} />}</div>
						</div>
					)}
				</ContextPanelConsumer>
			)}
		</WidthConsumer>
	);
});

export const FullPageContentArea = injectIntl(Content, { forwardRef: true });
