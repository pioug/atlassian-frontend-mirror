/** @jsx jsx */
import { jsx, useTheme } from '@emotion/react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { WidthConsumer } from '@atlaskit/editor-common/ui';
import { ContextPanelConsumer } from '../../ContextPanel/context';
import { EditorView } from 'prosemirror-view';
import React, { ReactElement } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

import EditorActions from '../../../actions';
import { EventDispatcher } from '../../../event-dispatcher';
import {
  ReactComponents,
  EditorAppearance,
  UIComponentFactory,
} from '../../../types';
import { ClickAreaBlock } from '../../Addon';
import ContextPanel from '../../ContextPanel';
import PluginSlot from '../../PluginSlot';
import WidthEmitter from '../../WidthEmitter';
import {
  contentArea,
  editorContentAreaStyle,
  sidebarArea,
  ScrollContainer,
  editorContentGutterStyle,
  positionedOverEditorStyle,
} from './StyledComponents';
import { DispatchAnalyticsEvent } from '../../../plugins/analytics';
import messages from './messages';
import { ThemeProps } from '@atlaskit/theme/types';

interface FullPageEditorContentAreaProps {
  appearance: EditorAppearance | undefined;
  contentArea: HTMLElement | undefined;
  contentComponents: UIComponentFactory[] | undefined;
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
  scrollContainer: HTMLElement | null;
  contentAreaRef(ref: HTMLElement | null): void;
  scrollContainerRef(ref: HTMLElement | null): void;
  wrapperElement: HTMLElement | null;
}

export const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';

const Content: React.FunctionComponent<
  FullPageEditorContentAreaProps & WrappedComponentProps
> = React.memo((props) => {
  const theme: ThemeProps = useTheme();
  const fullWidthMode = props.appearance === 'full-width';
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
                ref={props.scrollContainerRef}
                className="fabric-editor-popup-scroll-parent"
              >
                <ClickAreaBlock editorView={props.editorView}>
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
                    ref={props.contentAreaRef}
                  >
                    <div
                      css={editorContentGutterStyle}
                      className={[
                        'ak-editor-content-area',
                        fullWidthMode ? 'fabric-editor--full-width-mode' : '',
                      ].join(' ')}
                    >
                      {props.customContentComponents}
                      <PluginSlot
                        editorView={props.editorView}
                        editorActions={props.editorActions}
                        eventDispatcher={props.eventDispatcher}
                        providerFactory={props.providerFactory}
                        appearance={props.appearance}
                        items={props.contentComponents}
                        contentArea={props.contentArea}
                        popupsMountPoint={props.popupsMountPoint}
                        popupsBoundariesElement={props.popupsBoundariesElement}
                        popupsScrollableElement={props.popupsScrollableElement}
                        disabled={!!props.disabled}
                        containerElement={props.scrollContainer}
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
              <WidthEmitter editorView={props.editorView} />
            </div>
          )}
        </ContextPanelConsumer>
      )}
    </WidthConsumer>
  );
});

export const FullPageContentArea = injectIntl(Content);
