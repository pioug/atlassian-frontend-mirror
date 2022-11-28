import React, { createRef } from 'react';

import classnames from 'classnames';
import { EditorView } from 'prosemirror-view';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

import { TableLayout } from '@atlaskit/adf-schema';
import { Popup } from '@atlaskit/editor-common/ui';
import type { PopupPosition } from '@atlaskit/editor-common/ui';
import CollapseIcon from '@atlaskit/icon/glyph/editor/collapse';
import ExpandIcon from '@atlaskit/icon/glyph/editor/expand';

import commonMessages from '@atlaskit/editor-common/messages';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { toggleTableLayoutWithAnalytics } from '../../commands-with-analytics';
import { TableCssClassName as ClassName } from '../../types';
import { RowStickyState } from '../../pm-plugins/sticky-headers';
import { findDomRefAtPos } from 'prosemirror-utils';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

export interface Props {
  editorView: EditorView;
  targetRef?: HTMLElement;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  isResizing?: boolean;
  layout?: TableLayout;
  stickyHeader?: RowStickyState;
  editorAnalyticsAPI?: EditorAnalyticsAPI;
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
  private stickyButtonRef = createRef<HTMLDivElement>();

  private resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const resizeButton = this.stickyButtonRef.current;
      const tableWrapper = this.props.targetRef;
      if (resizeButton && tableWrapper) {
        const clientRect = tableWrapper.getBoundingClientRect();
        resizeButton.style.left = `${clientRect.right}px`;
      }
    });
  });

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

  renderSticky(button: JSX.Element, targetRef: Node, tableRef: Node) {
    const title = this.getTitle();

    if (
      !(targetRef instanceof HTMLElement) ||
      !(tableRef instanceof HTMLElement)
    ) {
      return null;
    }
    const pos = targetRef.getBoundingClientRect();
    const tablePos = tableRef.getBoundingClientRect();

    return (
      <div
        ref={this.stickyButtonRef}
        aria-label={title}
        style={{
          position: 'fixed',
          top: pos.top + 22,
          left: tablePos.right,
        }}
      >
        {button}
      </div>
    );
  }

  renderPopup(button: JSX.Element) {
    const { mountPoint, boundariesElement, scrollableElement, targetRef } =
      this.props;

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
    if (stickyTargetRef && this.props.targetRef) {
      return this.renderSticky(button, stickyTargetRef, this.props.targetRef);
    } else {
      return this.renderPopup(button);
    }
  }

  componentDidMount() {
    const dom = this.props.editorView.dom;
    const scrollPanel = dom.closest('.fabric-editor-popup-scroll-parent');
    if (scrollPanel instanceof HTMLElement) {
      this.resizeObserver.observe(scrollPanel);
    }
  }

  componentWillUnmount() {
    const dom = this.props.editorView.dom;
    const scrollPanel = dom.closest('.fabric-editor-popup-scroll-parent');
    if (scrollPanel instanceof HTMLElement) {
      this.resizeObserver.unobserve(scrollPanel);
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    const { targetRef, layout, isResizing, stickyHeader } = this.props;
    return (
      stickyHeader !== nextProps.stickyHeader ||
      targetRef !== nextProps.targetRef ||
      layout !== nextProps.layout ||
      isResizing !== nextProps.isResizing
    );
  }

  private handleClick = () => {
    const { state, dispatch } = this.props.editorView;
    toggleTableLayoutWithAnalytics(this.props.editorAnalyticsAPI)(
      state,
      dispatch,
    );
  };
}

export default injectIntl(LayoutButton);
