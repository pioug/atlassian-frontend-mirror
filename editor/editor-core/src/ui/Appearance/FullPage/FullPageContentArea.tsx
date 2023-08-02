/** @jsx jsx */
import { jsx, useTheme } from '@emotion/react';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  WidthConsumer,
  ContextPanelConsumer,
} from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { ReactElement } from 'react';
import React, { useImperativeHandle, useRef } from 'react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type EditorActions from '../../../actions';
import type { EventDispatcher } from '../../../event-dispatcher';
import type {
  ReactComponents,
  EditorAppearance,
  UIComponentFactory,
} from '../../../types';
import { ClickAreaBlock } from '../../Addon';
import ContextPanel from '../../ContextPanel';
import PluginSlot from '../../PluginSlot';
import {
  contentArea,
  editorContentAreaStyle,
  sidebarArea,
  ScrollContainer,
  editorContentGutterStyle,
  positionedOverEditorStyle,
} from './StyledComponents';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { fullPageMessages as messages } from '@atlaskit/editor-common/messages';
import type { ThemeProps } from '@atlaskit/theme/types';
import type { ReactHookFactory } from '@atlaskit/editor-common/types';
import type { FeatureFlags } from '../../../types/feature-flags';

interface FullPageEditorContentAreaProps {
  appearance: EditorAppearance | undefined;
  contentComponents: UIComponentFactory[] | undefined;
  pluginHooks: ReactHookFactory[] | undefined;
  contextPanel: ReactComponents | undefined;
  customContentComponents: ReactComponents | undefined;
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
  const theme: ThemeProps = useTheme();
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
                contentArea,
                positionedOverEditor && positionedOverEditorStyle,
              ]}
              data-testid={CONTENT_AREA_TEST_ID}
            >
              <ScrollContainer
                className="fabric-editor-popup-scroll-parent"
                featureFlags={props.featureFlags}
                ref={scrollContainerRef}
              >
                <ClickAreaBlock
                  editorView={props.editorView}
                  editorDisabled={props.disabled}
                >
                  <div
                    css={editorContentAreaStyle({
                      fullWidthMode,
                      layoutMaxWidth: theme.layoutMaxWidth,
                      containerWidth: width,
                    })}
                    role="region"
                    aria-label={props.intl.formatMessage(
                      messages.editableContentLabel,
                    )}
                    ref={contentAreaRef}
                  >
                    <div
                      css={editorContentGutterStyle}
                      className={[
                        'ak-editor-content-area',
                        fullWidthMode ? 'fabric-editor--full-width-mode' : '',
                      ].join(' ')}
                      ref={contentAreaRef}
                    >
                      {props.customContentComponents}
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
                    </div>
                  </div>
                </ClickAreaBlock>
              </ScrollContainer>
              <div css={sidebarArea}>
                {props.contextPanel || <ContextPanel visible={false} />}
              </div>
            </div>
          )}
        </ContextPanelConsumer>
      )}
    </WidthConsumer>
  );
});

export const FullPageContentArea = injectIntl(Content, { forwardRef: true });
