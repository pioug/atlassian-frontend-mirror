import React from 'react';
import { PluginKey } from 'prosemirror-state';
import rafSchedule from 'raf-schd';

import { pluginKey as contextPanelPluginKey } from '../../../plugins/context-panel';
import { akEditorToolbarKeylineHeight } from '../../../styles';
import { EditorAppearanceComponentProps } from '../../../types';
import { FullPageEditorWrapper } from './StyledComponents';
import { ContextPanelWidthProvider } from '../../ContextPanel/context';
import { FullPageContentArea } from './FullPageContentArea';
import { FullPageToolbar } from './FullPageToolbar';

interface FullPageEditorState {
  showKeyline: boolean;
  contextPanelVisible: boolean;
}

type PluginKeyWithKey = PluginKey & { key: string };

export class FullPageEditor extends React.Component<
  EditorAppearanceComponentProps,
  FullPageEditorState
> {
  state: FullPageEditorState = {
    showKeyline: false,
    contextPanelVisible: false,
  };

  static displayName = 'FullPageEditor';
  private scrollContainer: HTMLElement | null = null;
  private contentArea: HTMLElement | undefined;
  private scheduledKeylineUpdate: number | undefined;

  private contentAreaRef = (contentArea: HTMLElement) => {
    this.contentArea = contentArea;
  };

  private scrollContainerRef = (ref: HTMLElement | null) => {
    const previousScrollContainer = this.scrollContainer;

    // remove existing handler
    if (previousScrollContainer) {
      previousScrollContainer.removeEventListener(
        'scroll',
        this.updateToolbarKeyline,
      );
    }

    this.scrollContainer = ref ? ref : null;

    if (this.scrollContainer) {
      this.scrollContainer.addEventListener(
        'scroll',
        this.updateToolbarKeyline,
        false,
      );
      this.updateToolbarKeyline();
    }
  };

  private updateToolbarKeyline = rafSchedule(() => {
    if (!this.scrollContainer) {
      return false;
    }

    const { scrollTop } = this.scrollContainer;
    const showKeyline = scrollTop > akEditorToolbarKeylineHeight;
    if (showKeyline !== this.state.showKeyline) {
      this.setState({ showKeyline });
    }

    return false;
  });

  private handleResize = () => {
    this.scheduledKeylineUpdate = this.updateToolbarKeyline();
  };

  private setContextPanelVisibility = ({ visible }: { visible: boolean }) => {
    if (visible !== this.state.contextPanelVisible) {
      this.setState({ contextPanelVisible: visible });
    }
  };

  public componentDidMount() {
    window.addEventListener('resize', this.handleResize, false);
    if (this.props.eventDispatcher) {
      this.props.eventDispatcher.on(
        (contextPanelPluginKey as PluginKeyWithKey).key,
        this.setContextPanelVisibility,
      );
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);

    if (this.scheduledKeylineUpdate) {
      cancelAnimationFrame(this.scheduledKeylineUpdate);
    }

    if (this.props.eventDispatcher) {
      this.props.eventDispatcher.off(
        (contextPanelPluginKey as PluginKeyWithKey).key,
        this.setContextPanelVisibility,
      );
    }
  }

  public render() {
    const { props } = this;
    const { showKeyline, contextPanelVisible } = this.state;

    return (
      <ContextPanelWidthProvider>
        <FullPageEditorWrapper className="akEditor">
          <FullPageToolbar
            appearance={props.appearance}
            collabEdit={props.collabEdit}
            customPrimaryToolbarComponents={
              props.customPrimaryToolbarComponents
            }
            disabled={!!props.disabled}
            dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
            editorActions={props.editorActions}
            editorDOMElement={props.editorDOMElement}
            editorView={props.editorView!}
            eventDispatcher={props.eventDispatcher!}
            popupsBoundariesElement={props.popupsBoundariesElement}
            popupsMountPoint={props.popupsMountPoint}
            popupsScrollableElement={props.popupsScrollableElement}
            primaryToolbarComponents={props.primaryToolbarComponents}
            providerFactory={props.providerFactory}
            showKeyline={showKeyline || contextPanelVisible}
          />
          <FullPageContentArea
            allowAnnotation={props.allowAnnotation}
            appearance={props.appearance}
            contentArea={this.contentArea}
            contentAreaRef={this.contentAreaRef}
            contentComponents={props.contentComponents}
            contextPanel={props.contextPanel}
            customContentComponents={props.customContentComponents}
            disabled={props.disabled}
            dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
            editorActions={props.editorActions}
            editorDOMElement={props.editorDOMElement}
            editorView={props.editorView!}
            eventDispatcher={props.eventDispatcher}
            popupsBoundariesElement={props.popupsBoundariesElement}
            popupsMountPoint={props.popupsMountPoint}
            popupsScrollableElement={props.popupsScrollableElement}
            providerFactory={props.providerFactory}
            scrollContainer={this.scrollContainer}
            scrollContainerRef={this.scrollContainerRef}
          />
        </FullPageEditorWrapper>
      </ContextPanelWidthProvider>
    );
  }
}
