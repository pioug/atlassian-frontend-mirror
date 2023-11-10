/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import { B300, N300, N20A } from '@atlaskit/theme/colors';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
  findParentDomRefOfType,
  findDomRefAtPos,
} from '@atlaskit/editor-prosemirror/utils';
import { Popup } from '@atlaskit/editor-common/ui';
import CollapseIcon from '@atlaskit/icon/glyph/editor/collapse';
import ExpandIcon from '@atlaskit/icon/glyph/editor/expand';
import ToolbarButton from '../../../ui/ToolbarButton';
import { getBreakoutMode } from '../utils/get-breakout-mode';
import { setBreakoutMode } from '../commands/set-breakout-mode';
import { removeBreakout } from '../commands/remove-breakout';
import { BreakoutCssClassName } from '@atlaskit/editor-common/styles';
import { isBreakoutMarkAllowed } from '../utils/is-breakout-mark-allowed';
import { getPluginState } from '../plugin-key';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { BreakoutPluginState } from '../types';
import { isSupportedNodeForBreakout } from '../utils/is-supported-node';
import { token } from '@atlaskit/tokens';
import { layers } from '@atlaskit/theme/constants';
import type { BreakoutMode } from '@atlaskit/editor-common/types';
import { getNextBreakoutMode, getTitle } from '@atlaskit/editor-common/utils';

const toolbarButtonWrapper = css`
  && button {
    background: ${token('color.background.neutral', N20A)};
    color: ${token('color.icon', N300)};
    :hover {
      background: ${token('color.background.neutral.hovered', B300)};
      color: ${token('color.icon', 'white')} !important;
    }
  }
`;

export interface Props {
  editorView: EditorView;
  mountPoint?: HTMLElement;
  node: PMNode | null;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  handleClick?: Function;
}

function getBreakoutNodeElement(
  pluginState: BreakoutPluginState,
  selection: Selection,
  editorView: EditorView,
): HTMLElement | undefined {
  if (!pluginState.breakoutNode) {
    return undefined;
  }

  if (
    selection instanceof NodeSelection &&
    isSupportedNodeForBreakout(selection.node)
  ) {
    return findDomRefAtPos(
      selection.from,
      editorView.domAtPos.bind(editorView),
    ) as HTMLElement;
  }
  return findParentDomRefOfType(
    pluginState.breakoutNode.node.type,
    editorView.domAtPos.bind(editorView),
  )(selection) as HTMLElement;
}

class LayoutButton extends React.Component<Props & WrappedComponentProps, {}> {
  static displayName = 'LayoutButton';

  private handleClick = (breakoutMode: BreakoutMode) => () => {
    const { state, dispatch } = this.props.editorView;
    if (['wide', 'full-width'].indexOf(breakoutMode) !== -1) {
      setBreakoutMode(breakoutMode)(state, dispatch);
    } else {
      removeBreakout()(state, dispatch);
    }
  };

  render() {
    const {
      intl: { formatMessage },
      mountPoint,
      boundariesElement,
      scrollableElement,
      editorView,
      node,
    } = this.props;

    const { state } = editorView;

    if (!node || !isBreakoutMarkAllowed(state)) {
      return null;
    }

    const breakoutMode = getBreakoutMode(editorView.state);
    const titleMessage = getTitle(breakoutMode);
    const title = formatMessage(titleMessage);
    const nextBreakoutMode = getNextBreakoutMode(breakoutMode);
    const belowOtherPopupsZIndex = layers.layer() - 1;

    let pluginState = getPluginState(state);

    if (!pluginState) {
      return null;
    }

    let element = getBreakoutNodeElement(
      pluginState,
      state.selection,
      editorView,
    );
    if (!element) {
      return null;
    }

    const closestEl = element.querySelector(
      `.${BreakoutCssClassName.BREAKOUT_MARK_DOM}`,
    );

    if (closestEl && closestEl.firstChild) {
      element = closestEl.firstChild as HTMLElement;
    }

    return (
      <Popup
        ariaLabel={title}
        target={element}
        offset={[5, 0]}
        alignY="start"
        alignX="end"
        mountTo={mountPoint}
        boundariesElement={boundariesElement}
        scrollableElement={scrollableElement}
        stick={true}
        forcePlacement={true}
        zIndex={belowOtherPopupsZIndex}
      >
        <div css={toolbarButtonWrapper}>
          <ToolbarButton
            title={title}
            testId={titleMessage.id}
            onClick={this.handleClick(nextBreakoutMode)}
            iconBefore={
              breakoutMode === 'full-width' ? (
                <CollapseIcon label={title} />
              ) : (
                <ExpandIcon label={title} />
              )
            }
          />
        </div>
      </Popup>
    );
  }
}

export default injectIntl(LayoutButton);
