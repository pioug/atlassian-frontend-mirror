import React from 'react';
import Transition from 'react-transition-group/Transition';
import styled from 'styled-components';
import { N30 } from '@atlaskit/theme/colors';
import { akEditorSwoopCubicBezier } from '@atlaskit/editor-shared-styles';
import { ContextPanelConsumer } from './context';
import WithPluginState from '../WithPluginState';
import {
  pluginKey as contextPanelPluginKey,
  ContextPanelPluginState,
} from '../../plugins/context-panel';
import WithEditorActions from '../WithEditorActions';
import { EditorView } from 'prosemirror-view';

export type Props = {
  visible: boolean;
  width?: number;
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
  box-shadow: inset 2px 0 0 0 ${N30};
`;

export const Content = styled.div<StyleProps>`
  box-sizing: border-box;
  padding: 16px 16px 0px;
  width: ${p => p.panelWidth}px;
  height: 100%;
  overflow-y: auto;
`;

type SwappableContentAreaProps = {
  pluginContent?: React.ReactNode;
  editorView?: EditorView;
} & Props;

type State = {
  mounted: boolean;
  currentPluginContent?: React.ReactNode;
};

export class SwappableContentArea extends React.PureComponent<
  SwappableContentAreaProps,
  State
> {
  state = {
    mounted: false,
    currentPluginContent: undefined,
  };

  static getDerivedStateFromProps(
    props: SwappableContentAreaProps,
    state: State,
  ): State | null {
    if (props.pluginContent !== state.currentPluginContent) {
      return {
        ...state,
        currentPluginContent: props.pluginContent,
      };
    }

    return null;
  }

  private unsetPluginContent() {
    this.setState({ currentPluginContent: undefined });
  }

  componentDidMount() {
    // use this to trigger an animation
    this.setState({
      mounted: true,
    });
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
    const { currentPluginContent } = this.state;

    const width = currentPluginContent
      ? DEFAULT_CONTEXT_PANEL_WIDTH
      : this.props.width || DEFAULT_CONTEXT_PANEL_WIDTH;

    const userVisible = !!this.props.visible;
    const visible = userVisible || !!this.state.currentPluginContent;

    return (
      <ContextPanelConsumer>
        {({ broadcastWidth }) => {
          broadcastWidth(visible ? width : 0);

          return (
            <Panel panelWidth={width} visible={visible}>
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
