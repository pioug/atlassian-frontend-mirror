import React from 'react';
import Transition from 'react-transition-group/Transition';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { akEditorSwoopCubicBezier } from '@atlaskit/editor-common';
import { ContextPanelConsumer } from './context';
import WithPluginState from '../WithPluginState';
import {
  pluginKey as contextPanelPluginKey,
  ContextPanelPluginState,
  getPluginState,
} from '../../plugins/context-panel';
import WithEditorActions from '../WithEditorActions';
import { EditorView } from 'prosemirror-view';

export type Props = {
  visible?: boolean;
  width?: number;
  onVisibilityChange?: ({ visible }: { visible: boolean }) => void;
  children?: React.ReactElement;
};

const ANIM_SPEED_MS = 500;
export const DEFAULT_CONTEXT_PANEL_WIDTH = 360;

type StyleProps = {
  panelWidth: number;
};

export const Panel = styled.div<
  StyleProps & {
    visible: boolean;
  }
>`
  will-change: width;
  width: ${p => (p.visible ? p.panelWidth : 0)}px;
  height: 100%;
  transition: width ${ANIM_SPEED_MS}ms ${akEditorSwoopCubicBezier};
  overflow: hidden;
  box-shadow: inset 2px 0 0 0 ${colors.N30};
`;

export const Content = styled.div<StyleProps>`
  box-sizing: border-box;
  padding: 16px 16px 0px;
  width: ${p => p.panelWidth}px;
  height: 100%;
  overflow-y: scroll;
`;

type SwappableContentAreaProps = {
  pluginContent?: React.ReactNode;
  editorView?: EditorView;
} & Props;

type State = {
  mounted: boolean;
  currentPluginContent?: React.ReactNode;
};

export class SwappableContentArea extends React.Component<
  SwappableContentAreaProps,
  State
> {
  state = {
    mounted: false,
    currentPluginContent: undefined,
  };

  private setContextPanelVisibility(visible: boolean) {
    if (this.props.editorView) {
      const { editorView, onVisibilityChange } = this.props;
      const { dispatch, state } = editorView;

      const currentPluginState = getPluginState(state);

      if (currentPluginState.visible !== visible) {
        dispatch(
          state.tr.setMeta(contextPanelPluginKey, {
            visible: visible,
          }),
        );

        onVisibilityChange && onVisibilityChange({ visible });
      }
    }
  }

  private setPluginContent(pluginContent?: React.ReactNode) {
    if (pluginContent && this.state.currentPluginContent !== pluginContent) {
      this.setState({ currentPluginContent: pluginContent });
    }
  }

  private unsetPluginContent() {
    this.setState({ currentPluginContent: undefined });
  }

  getVisibility() {
    const { pluginContent, children, visible } = this.props;

    const userVisible = !!(
      visible ||
      (typeof visible === 'undefined' && children)
    );

    return !!(pluginContent || userVisible);
  }

  manageVisibilityAndContent() {
    // there are safe guards in place inside the method to avoig calling it unnecessary
    this.setContextPanelVisibility(this.getVisibility());

    // When plugin adds content, we save it to state so we can unmount it on a transition.
    // We only remove it from state after transition is done
    this.setPluginContent(this.props.pluginContent);
  }

  componentDidMount() {
    // use this to trigger an animation
    this.setState({
      mounted: true,
    });

    this.manageVisibilityAndContent();
  }

  componentDidUpdate() {
    this.manageVisibilityAndContent();
  }

  showPluginContent = () => {
    const { pluginContent } = this.props;
    const { currentPluginContent } = this.state;

    if (!currentPluginContent) {
      return;
    }

    return (
      <Transition
        timeout={this.state.mounted ? ANIM_SPEED_MS : 0}
        in={!!pluginContent}
        mountOnEnter
        unmountOnExit
        onExited={() => this.unsetPluginContent()}
      >
        {currentPluginContent}
      </Transition>
    );
  };

  showProvidedContent = (isVisible: boolean) => {
    const { children } = this.props;

    if (!children) {
      return;
    }

    return (
      <Transition
        timeout={this.state.mounted ? ANIM_SPEED_MS : 0}
        in={isVisible}
        mountOnEnter
        unmountOnExit
      >
        {children}
      </Transition>
    );
  };

  render() {
    const { pluginContent, children, visible } = this.props;
    const { currentPluginContent } = this.state;

    const width = currentPluginContent
      ? DEFAULT_CONTEXT_PANEL_WIDTH
      : this.props.width || DEFAULT_CONTEXT_PANEL_WIDTH;

    const userVisible = !!(
      visible ||
      (typeof visible === 'undefined' && children)
    );

    const isVisible = !!(pluginContent || userVisible);

    return (
      <ContextPanelConsumer>
        {({ broadcastWidth }) => {
          broadcastWidth(isVisible ? width : 0);

          return (
            <Panel panelWidth={width} visible={isVisible}>
              <Content panelWidth={width}>
                {this.showPluginContent() ||
                  this.showProvidedContent(userVisible)}
              </Content>
            </Panel>
          );
        }}
      </ContextPanelConsumer>
    );
  }
}

export default class ContextPanel extends React.Component<Props> {
  static defaultProps = {
    width: DEFAULT_CONTEXT_PANEL_WIDTH,
  };

  render() {
    return (
      <WithEditorActions
        render={actions => {
          const eventDispatcher = actions._privateGetEventDispatcher();
          const editorView = actions._privateGetEditorView();

          if (!eventDispatcher) {
            return (
              <SwappableContentArea editorView={editorView} {...this.props} />
            );
          }

          return (
            <WithPluginState
              eventDispatcher={eventDispatcher}
              plugins={{
                contextPanel: contextPanelPluginKey,
              }}
              render={({
                contextPanel,
              }: {
                contextPanel?: ContextPanelPluginState;
              }) => {
                const firstContent =
                  contextPanel && contextPanel.contents.find(Boolean);

                return (
                  <SwappableContentArea
                    {...this.props}
                    editorView={editorView}
                    pluginContent={firstContent}
                  />
                );
              }}
            />
          );
        }}
      />
    );
  }
}
