import React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { akEditorSwoopCubicBezier } from '@atlaskit/editor-common';
import { ContextPanelConsumer } from './context';
import WithPluginState from '../WithPluginState';
import {
  pluginKey as contextPanelPluginKey,
  ContextPanelPluginState,
} from '../../plugins/context-panel';
import WithEditorActions from '../WithEditorActions';
import { EditorView } from 'prosemirror-view';

export type Props = {
  visible?: boolean;
  width?: number;
};

const ANIM_SPEED = '0.2s';
export const DEFAULT_CONTEXT_PANEL_WIDTH = 300;

type StyleProps = {
  panelWidth: number;
};

export const Panel = styled.div<
  StyleProps & {
    visible: boolean;
  }
>`
  width: ${p => (p.visible ? p.panelWidth : 0)}px;
  height: 100%;
  transition: width ${ANIM_SPEED} ${akEditorSwoopCubicBezier};
  overflow: hidden;
`;

export const Content = styled.div<StyleProps>`
  box-sizing: border-box;
  padding: 16px 16px 0px;
  box-shadow: inset 2px 0 0 0 ${colors.N30};

  width: ${p => p.panelWidth}px;
  height: 100%;
  overflow-y: scroll;
`;

type SwappableContentAreaProps = {
  pluginContent?: React.ReactNode;
  editorView?: EditorView;
} & Props;

export class SwappableContentArea extends React.Component<
  SwappableContentAreaProps
> {
  state = {
    mounted: false,
  };

  private setContextPanelVisibility() {
    if (this.props.editorView) {
      const { dispatch, state } = this.props.editorView;
      dispatch(
        state.tr.setMeta(contextPanelPluginKey, {
          visible: this.props.visible,
        }),
      );
    }
  }

  componentDidMount() {
    // use this to trigger an animation
    this.setState({
      mounted: true,
    });

    this.setContextPanelVisibility();
  }

  componentDidUpdate(prevProps: SwappableContentAreaProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setContextPanelVisibility();
    }
  }

  render() {
    const width = this.props.width || DEFAULT_CONTEXT_PANEL_WIDTH;
    const { pluginContent, children, visible } = this.props;

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
                {pluginContent || (userVisible ? children : null)}
              </Content>
            </Panel>
          );
        }}
      </ContextPanelConsumer>
    );
  }
}

export default class ContextPanel extends React.Component<Props> {
  render() {
    const { children } = this.props;

    return (
      <WithEditorActions
        render={actions => {
          const eventDispatcher = actions._privateGetEventDispatcher();
          const editorView = actions._privateGetEditorView();

          if (!eventDispatcher) {
            return (
              <SwappableContentArea editorView={editorView} {...this.props}>
                {children}
              </SwappableContentArea>
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
                  >
                    {children}
                  </SwappableContentArea>
                );
              }}
            />
          );
        }}
      />
    );
  }
}
