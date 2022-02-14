import React from 'react';

import classnames from 'classnames';
import { EditorView } from 'prosemirror-view';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

import { TableLayout } from '@atlaskit/adf-schema';
import { Popup } from '@atlaskit/editor-common/ui';
import type { PopupPosition } from '@atlaskit/editor-common/ui';
import CollapseIcon from '@atlaskit/icon/glyph/editor/collapse';
import ExpandIcon from '@atlaskit/icon/glyph/editor/expand';

import commonMessages from '../../../../messages';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { toggleTableLayoutWithAnalytics } from '../../commands-with-analytics';
import { TableCssClassName as ClassName } from '../../types';
import { RowStickyState } from '../../pm-plugins/sticky-headers';
import { findDomRefAtPos } from 'prosemirror-utils';

export interface Props {
  editorView: EditorView;
  targetRef?: HTMLElement;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  isResizing?: boolean;
  layout?: TableLayout;
  tableWidth?: number;
  stickyHeader?: RowStickyState;
}

const addPopupOffset = (pos: PopupPosition) => ({
  ...pos,

  // add 12 pixels to align y position with
  //the columns controls
  top: pos.top ? pos.top + 12 : undefined,
});

const getMessage = (layout: TableLayout) => {
  switch (layout) {
    case 'default':
      return commonMessages.layoutWide;
    case 'wide':
      return commonMessages.layoutFullWidth;
    default:
      return commonMessages.layoutFixedWidth;
  }
};

class LayoutButton extends React.Component<Props & WrappedComponentProps, any> {
  static displayName = 'LayoutButton';

  getTitle() {
    const {
      intl: { formatMessage },
      layout = 'default',
    } = this.props;
    return formatMessage(getMessage(layout));
  }

  toolbarButton() {
    const { isResizing, layout = 'default' } = this.props;
    const title = this.getTitle();

    return (
      <div
        className={classnames(ClassName.LAYOUT_BUTTON, {
          [ClassName.IS_RESIZING]: isResizing,
        })}
      >
        <ToolbarButton
          title={title}
          onClick={this.handleClick}
          iconBefore={
            layout === 'full-width' ? (
              <CollapseIcon label={title} />
            ) : (
              <ExpandIcon label={title} />
            )
          }
        />
      </div>
    );
  }

  getStickyTargetRef(pos: number): Node | null {
    const { editorView } = this.props;
    const domAtPos = editorView.domAtPos.bind(editorView);
    const node = findDomRefAtPos(pos, domAtPos) as HTMLElement;
    return node.dataset['headerRow'] && node.classList.contains('sticky')
      ? node
      : null;
  }

  renderSticky(button: JSX.Element, targetRef: Node) {
    const title = this.getTitle();

    if (!targetRef || !(targetRef instanceof HTMLElement)) {
      return null;
    }

    const pos = targetRef.getBoundingClientRect();

    return (
      <div
        aria-label={title}
        style={{
          position: 'fixed',
          top: pos.top + 22,
          left: pos.right + 10,
        }}
      >
        {button}
      </div>
    );
  }

  renderPopup(button: JSX.Element) {
    const {
      mountPoint,
      boundariesElement,
      scrollableElement,
      targetRef,
    } = this.props;

    if (!targetRef) {
      return null;
    }

    const title = this.getTitle();

    return (
      <Popup
        ariaLabel={title}
        target={targetRef}
        alignY="start"
        alignX="end"
        onPositionCalculated={addPopupOffset}
        stick={true}
        mountTo={mountPoint}
        boundariesElement={boundariesElement}
        scrollableElement={scrollableElement}
        forcePlacement={true}
      >
        {button}
      </Popup>
    );
  }

  render() {
    const { stickyHeader } = this.props;
    const button = this.toolbarButton();

    const stickyTargetRef =
      stickyHeader && stickyHeader.sticky && stickyHeader.pos
        ? this.getStickyTargetRef(stickyHeader.pos)
        : null;
    if (stickyTargetRef) {
      return this.renderSticky(button, stickyTargetRef);
    } else {
      return this.renderPopup(button);
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    const {
      targetRef,
      layout,
      isResizing,
      tableWidth,
      stickyHeader,
    } = this.props;
    return (
      stickyHeader !== nextProps.stickyHeader ||
      targetRef !== nextProps.targetRef ||
      layout !== nextProps.layout ||
      isResizing !== nextProps.isResizing ||
      tableWidth !== nextProps.tableWidth
    );
  }

  private handleClick = () => {
    const { state, dispatch } = this.props.editorView;
    toggleTableLayoutWithAnalytics()(state, dispatch);
  };
}

export default injectIntl(LayoutButton);
