import React from 'react';

import * as colors from '@atlaskit/theme/colors';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { findParentDomRefOfType, findDomRefAtPos } from 'prosemirror-utils';
import { Popup } from '@atlaskit/editor-common';
import CollapseIcon from '@atlaskit/icon/glyph/editor/collapse';
import ExpandIcon from '@atlaskit/icon/glyph/editor/expand';
import ToolbarButton from '../../../ui/ToolbarButton';
import styled from 'styled-components';
import { getBreakoutMode } from '../utils/get-breakout-mode';
import { setBreakoutMode, BreakoutMode } from '../commands/set-breakout-mode';
import { removeBreakout } from '../commands/remove-breakout';
import commonMessages from '../../../messages';
import { BreakoutCssClassName } from '../constants';
import { isBreakoutMarkAllowed } from '../utils/is-breakout-mark-allowed';
import { getPluginState } from '../plugin-key';
import { NodeSelection, Selection } from 'prosemirror-state';
import { BreakoutPluginState } from '../types';
import { isSupportedNodeForBreakout } from '../utils/is-supported-node';

const { B300, N300, N20A } = colors;

const Wrapper = styled.div`
  && button {
    background: ${N20A};
    color: ${N300};
    :hover {
      background: ${B300};
      color: white !important;
    }
  }
`;

interface Props {
  editorView: EditorView;
  mountPoint?: HTMLElement;
  node: PMNode | null;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  handleClick?: Function;
}

const BREAKOUT_MODE: Record<string, BreakoutMode> = {
  FULL_WIDTH: 'full-width',
  CENTER: 'center',
  WIDE: 'wide',
};

const getNextBreakoutMode = (currentMode?: BreakoutMode): BreakoutMode => {
  if (currentMode === BREAKOUT_MODE.FULL_WIDTH) {
    return BREAKOUT_MODE.CENTER;
  } else if (currentMode === BREAKOUT_MODE.WIDE) {
    return BREAKOUT_MODE.FULL_WIDTH;
  }

  return BREAKOUT_MODE.WIDE;
};

const getTitle = (layout?: BreakoutMode) => {
  switch (layout) {
    case BREAKOUT_MODE.FULL_WIDTH:
      return commonMessages.layoutFixedWidth;
    case BREAKOUT_MODE.WIDE:
      return commonMessages.layoutFullWidth;
    default:
      return commonMessages.layoutWide;
  }
};

function getBreakoutNodeElement(
  pluginState: BreakoutPluginState,
  selection: Selection,
  editorView: EditorView,
): HTMLElement | undefined {
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
    pluginState.breakoutNode.type,
    editorView.domAtPos.bind(editorView),
  )(selection) as HTMLElement;
}

class LayoutButton extends React.Component<Props & InjectedIntlProps, {}> {
  static displayName = 'LayoutButton';

  private handleClick = (breakoutMode: BreakoutMode) => () => {
    const { state, dispatch } = this.props.editorView;
    if (
      [BREAKOUT_MODE.WIDE, BREAKOUT_MODE.FULL_WIDTH].indexOf(breakoutMode) !==
      -1
    ) {
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

    let pluginState = getPluginState(state);

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
      >
        <Wrapper>
          <ToolbarButton
            title={title}
            testId={titleMessage.id}
            onClick={this.handleClick(nextBreakoutMode)}
            iconBefore={
              breakoutMode === BREAKOUT_MODE.FULL_WIDTH ? (
                <CollapseIcon label={title} />
              ) : (
                <ExpandIcon label={title} />
              )
            }
          />
        </Wrapper>
      </Popup>
    );
  }
}

export default injectIntl(LayoutButton);
