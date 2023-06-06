/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx } from '@emotion/react';
import Transition from 'react-transition-group/Transition';
import { N30 } from '@atlaskit/theme/colors';
import {
  akEditorSwoopCubicBezier,
  akEditorDefaultLayoutWidth,
  akEditorWideLayoutWidth,
  akEditorBreakoutPadding,
  akEditorContextPanelWidth,
  ATLASSIAN_NAVIGATION_HEIGHT,
} from '@atlaskit/editor-shared-styles';
import { ContextPanelConsumer } from '@atlaskit/editor-common/ui';
import WithPluginState from '../WithPluginState';
import { pluginKey as contextPanelPluginKey } from '../../plugins/context-panel';
import type { WidthPluginState } from '@atlaskit/editor-plugin-width';
import WithEditorActions from '../WithEditorActions';
import { EditorView } from 'prosemirror-view';
import { getChildBreakoutModes } from '../../utils/document';
import { BreakoutMarkAttrs } from '@atlaskit/adf-schema';
import { token } from '@atlaskit/tokens';
import type EditorActions from '../../actions';
import { WidthContext } from '@atlaskit/editor-common/ui';

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
  containerWidth?: number;
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

const panelHidden = css`
  width: 0;
`;

export const panel = css`
  width: ${akEditorContextPanelWidth}px;
  height: 100%;
  transition: width ${ANIM_SPEED_MS}ms ${akEditorSwoopCubicBezier};
  overflow: hidden;
  box-shadow: inset 2px 0 0 0 ${token('color.border', N30)};
`;

export const content = css`
  transition: width 600ms ${akEditorSwoopCubicBezier};
  box-sizing: border-box;
  padding: 16px 16px 0px;
  width: ${akEditorContextPanelWidth}px;
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
  focusEditor = () => {
    const { editorView } = this.props;
    if (editorView && !editorView.hasFocus()) {
      editorView.focus?.();
    }
  };

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
        onExiting={this.focusEditor}
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
          const contextPanelWidth = visible ? width : 0;
          const newPosition = editorWidth
            ? shouldPanelBePositionedOverEditor(editorWidth, width)
            : false;
          broadcastWidth(contextPanelWidth);
          (newPosition && visible) !== positionedOverEditor &&
            broadcastPosition(newPosition && visible);

          return (
            <div
              css={[
                panel,
                !visible && panelHidden,
                /**
                 * Only use absolute position for panel when screen size is wide enough
                 * to accommodate breakout content and editor is not in wide mode.
                 */
                newPosition && absolutePanelStyles,
              ]}
              data-testid="context-panel-panel"
              aria-labelledby="context-panel-title"
              role="dialog"
            >
              <div
                data-testid="context-panel-content"
                css={[content, !visible && panelHidden]}
              >
                {this.showPluginContent() ||
                  this.showProvidedContent(userVisible)}
              </div>
            </div>
          );
        }}
      </ContextPanelConsumer>
    );
  }
}

// TODO: ED-17837 We have this workaround because we do
// not have access to the pluginInjectionApi at this location.
// It might be that we need to inject the pluginInjectionApi
// via context so that we can use it in this file (similar to
// WithEditorActions). To be investigated further.
import { PluginKey, EditorState } from 'prosemirror-state';
// @ts-ignore
const widthPluginKey = {
  key: 'widthPlugin$',
  getState: (state: EditorState) => {
    return (state as any)['widthPlugin$'];
  },
} as PluginKey;

function ContextPanelWithActions({
  actions,
  ...props
}: Props & { actions: EditorActions }) {
  const eventDispatcher = actions._privateGetEventDispatcher();
  const editorView = actions._privateGetEditorView();
  const { width } = useContext(WidthContext);

  if (!eventDispatcher) {
    return <SwappableContentArea editorView={editorView} {...props} />;
  }

  return (
    <WithPluginState
      eventDispatcher={eventDispatcher}
      plugins={{
        contextPanel: contextPanelPluginKey,
        widthState: widthPluginKey,
      }}
      render={({ contextPanel, widthState }) => {
        const firstContent =
          contextPanel && contextPanel.contents.find(Boolean);

        const editorWidth = {
          ...widthState,
          containerWidth: width,
          contentBreakoutModes: editorView
            ? getChildBreakoutModes(
                editorView.state.doc,
                editorView.state.schema,
              )
            : [],
        };

        return (
          <SwappableContentArea
            {...props}
            editorView={editorView}
            pluginContent={firstContent}
            editorWidth={editorWidth}
          />
        );
      }}
    />
  );
}

export default function ContextPanel(props: Props) {
  return (
    <WithEditorActions
      render={(actions) => (
        <ContextPanelWithActions actions={actions} {...props} />
      )}
    />
  );
}
