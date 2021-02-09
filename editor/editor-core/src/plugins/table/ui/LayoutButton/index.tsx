import React from 'react';

import classnames from 'classnames';
import { EditorView } from 'prosemirror-view';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import { TableLayout } from '@atlaskit/adf-schema';
import { Popup, PopupPosition } from '@atlaskit/editor-common';
import CollapseIcon from '@atlaskit/icon/glyph/editor/collapse';
import ExpandIcon from '@atlaskit/icon/glyph/editor/expand';

import commonMessages from '../../../../messages';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { toggleTableLayoutWithAnalytics } from '../../commands-with-analytics';
import { TableCssClassName as ClassName } from '../../types';

export interface Props {
  editorView: EditorView;
  targetRef?: HTMLElement;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  isResizing?: boolean;
  layout?: TableLayout;
  tableWidth?: number;
}

const addPopupOffset = (pos: PopupPosition) => ({
  ...pos,

  // add 22 pixels to align y position with
  //the columns controls
  top: pos.top ? pos.top + 22 : undefined,
});

const getTitle = (layout: TableLayout) => {
  switch (layout) {
    case 'default':
      return commonMessages.layoutWide;
    case 'wide':
      return commonMessages.layoutFullWidth;
    default:
      return commonMessages.layoutFixedWidth;
  }
};

class LayoutButton extends React.Component<Props & InjectedIntlProps, any> {
  static displayName = 'LayoutButton';

  render() {
    const {
      intl: { formatMessage },
      mountPoint,
      boundariesElement,
      scrollableElement,
      targetRef,
      isResizing,
      layout = 'default',
    } = this.props;
    if (!targetRef) {
      return null;
    }
    const title = formatMessage(getTitle(layout));

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
      </Popup>
    );
  }

  shouldComponentUpdate(nextProps: Props) {
    const { targetRef, layout, isResizing, tableWidth } = this.props;
    return (
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
