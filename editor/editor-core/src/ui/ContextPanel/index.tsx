import React from 'react';
import Transition from 'react-transition-group/Transition';
import styled from 'styled-components';
import { css } from 'styled-components';
import { N30 } from '@atlaskit/theme/colors';
import {
  akEditorSwoopCubicBezier,
  akEditorDefaultLayoutWidth,
  akEditorWideLayoutWidth,
  akEditorBreakoutPadding,
  akEditorContextPanelWidth,
  ATLASSIAN_NAVIGATION_HEIGHT,
} from '@atlaskit/editor-shared-styles';
import { ContextPanelConsumer } from './context';
import WithPluginState from '../WithPluginState';
import { pluginKey as contextPanelPluginKey } from '../../plugins/context-panel';
import {
  pluginKey as widthPluginKey,
  WidthPluginState,
} from '../../plugins/width';
import WithEditorActions from '../WithEditorActions';
import { EditorView } from 'prosemirror-view';
import { getChildBreakoutModes } from '../../utils/document';
import { BreakoutMarkAttrs } from '@atlaskit/adf-schema';

export type Props = {
  visible: boolean;
  children?: React.ReactElement;
};

const ANIM_SPEED_MS = 500;
const EDITOR_WIDTH = akEditorDefaultLayoutWidth + akEditorBreakoutPadding;
const WIDE_EDITOR_WIDTH = akEditorWideLayoutWidth + akEditorBreakoutPadding;
const FULLWIDTH_MODE = 'full-width';
const WIDE_MODE = 'wide';

type EditorWidth = WidthPluginState & {
  contentBreakoutModes: BreakoutMarkAttrs['mode'][];
};

type StyleProps = {
  panelWidth: number;
  visible: boolean;
};

type PanelProps = StyleProps & {
  positionPanelOverEditor: boolean;
};

const absolutePanelStyles = css`
  position: absolute;
  right: 0;
  height: calc(100% - ${ATLASSIAN_NAVIGATION_HEIGHT});
`;

export const shouldPanelBePositionedOverEditor = (
  editorWidth: EditorWidth,
  panelWidth: number,
): boolean => {
  const { lineLength, containerWidth = 0, contentBreakoutModes } = editorWidth;
  const editorNotFullWidth = !(
    lineLength && lineLength > akEditorDefaultLayoutWidth
  );
  const hasSpaceForPanel =
    !contentBreakoutModes.length &&
    containerWidth >= panelWidth * 2 + EDITOR_WIDTH;
  const hasSpaceForWideBreakoutsAndPanel =
    !contentBreakoutModes.includes(FULLWIDTH_MODE) &&
    contentBreakoutModes.includes(WIDE_MODE) &&
    containerWidth >= panelWidth * 2 + WIDE_EDITOR_WIDTH;

  return (
    editorNotFullWidth && (hasSpaceForPanel || hasSpaceForWideBreakoutsAndPanel)
  );
};

/**
 * Only use absolute position for panel when screen size is wide enough
 * to accomodate breakout content and editor is not in wide mode.
 */
const panelSlideStyles = ({ positionPanelOverEditor }: PanelProps) => {
  if (positionPanelOverEditor) {
    return absolutePanelStyles;
  }
  return;
};

export const Panel = styled.div<PanelProps>`
  width: ${(p) => (p.visible ? p.panelWidth : 0)}px;
  height: 100%;
  transition: width ${ANIM_SPEED_MS}ms ${akEditorSwoopCubicBezier};
  overflow: hidden;
  box-shadow: inset 2px 0 0 0 ${N30};

  ${(props) => panelSlideStyles(props)};
`;

export const Content = styled.div<StyleProps>`
  transition: width 600ms ${akEditorSwoopCubicBezier};
  box-sizing: border-box;
  padding: 16px 16px 0px;
  width: ${(p) => (p.visible ? p.panelWidth : 0)}px;
  height: 100%;
  overflow-y: auto;
`;

type SwappableContentAreaProps = {
  pluginContent?: React.ReactNode;
  editorView?: EditorView;
  editorWidth?: EditorWidth;
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
    const { editorWidth } = this.props;
    const width = akEditorContextPanelWidth;

    const userVisible = !!this.props.visible;
    const visible = userVisible || !!this.state.currentPluginContent;

    return (
      <ContextPanelConsumer>
        {({ broadcastWidth, broadcastPosition, positionedOverEditor }) => {
          const newPosition = editorWidth
            ? shouldPanelBePositionedOverEditor(editorWidth, width)
            : false;
          broadcastWidth(visible ? width : 0);
          (newPosition && visible) !== positionedOverEditor &&
            broadcastPosition(newPosition && visible);

          return (
            <Panel
              panelWidth={width}
              visible={visible}
              positionPanelOverEditor={newPosition}
              data-testid="context-panel-panel"
            >
              <Content panelWidth={width} visible={visible}>
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
  render() {
    return (
      <WithEditorActions
        render={(actions) => {
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
                widthState: widthPluginKey,
              }}
              render={({
                contextPanel,
                widthState = {
                  width: 0,
                  containerWidth: 0,
                  lineLength: akEditorDefaultLayoutWidth,
                },
              }) => {
                const firstContent =
                  contextPanel && contextPanel.contents.find(Boolean);

                const editorWidth = {
                  ...widthState,
                  contentBreakoutModes: editorView
                    ? getChildBreakoutModes(
                        editorView.state.doc,
                        editorView.state.schema,
                      )
                    : [],
                };

                return (
                  <SwappableContentArea
                    {...this.props}
                    editorView={editorView}
                    pluginContent={firstContent}
                    editorWidth={editorWidth}
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
