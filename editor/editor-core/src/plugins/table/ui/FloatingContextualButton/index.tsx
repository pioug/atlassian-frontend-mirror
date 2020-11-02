import React from 'react';

import { findDomRefAtPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';

import { TableLayout } from '@atlaskit/adf-schema';
import { Popup } from '@atlaskit/editor-common';
import {
  akEditorFloatingOverlapPanelZIndex,
  akEditorSmallZIndex,
} from '@atlaskit/editor-shared-styles';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';

import ToolbarButton from '../../../../ui/ToolbarButton';
import { closestElement } from '../../../../utils/dom';
import { toggleContextualMenu } from '../../commands';
import { RowStickyState } from '../../pm-plugins/sticky-headers';
import { TableCssClassName as ClassName } from '../../types';
import messages from '../../ui/messages';
import { tableFloatingCellButtonStyles } from './styles.css';
import { Node as PMNode } from 'prosemirror-model';

export interface Props {
  editorView: EditorView;
  tableNode?: PMNode;
  targetCellPosition: number;
  isContextualMenuOpen?: boolean;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  layout?: TableLayout;
  isNumberColumnEnabled?: boolean;
  stickyHeader?: RowStickyState;
}

const ButtonWrapper = styled.div`
  ${tableFloatingCellButtonStyles}
`;

class FloatingContextualButton extends React.Component<
  Props & InjectedIntlProps,
  any
> {
  static displayName = 'FloatingContextualButton';

  render() {
    const {
      mountPoint,
      scrollableElement,
      editorView,
      targetCellPosition,
      isContextualMenuOpen,
      intl: { formatMessage },
    } = this.props; //  : Props & InjectedIntlProps
    const domAtPos = editorView.domAtPos.bind(editorView);
    const targetCellRef = findDomRefAtPos(targetCellPosition, domAtPos);

    if (!targetCellRef || !(targetCellRef instanceof HTMLElement)) {
      return null;
    }

    const tableWrapper = closestElement(
      targetCellRef,
      `.${ClassName.TABLE_NODE_WRAPPER}`,
    );

    const labelCellOptions = formatMessage(messages.cellOptions);

    const button = (
      <ButtonWrapper>
        <ToolbarButton
          className={ClassName.CONTEXTUAL_MENU_BUTTON}
          selected={isContextualMenuOpen}
          title={labelCellOptions}
          onClick={this.handleClick}
          iconBefore={<ExpandIcon label={labelCellOptions} />}
        />
      </ButtonWrapper>
    );

    const parentSticky =
      targetCellRef.parentElement &&
      targetCellRef.parentElement.className.indexOf('sticky') > -1;
    if (this.props.stickyHeader && parentSticky) {
      const pos = targetCellRef.getBoundingClientRect();

      return (
        <div
          style={{
            position: 'fixed',
            top:
              this.props.stickyHeader.top +
              this.props.stickyHeader.padding +
              3 +
              3,
            zIndex: akEditorFloatingOverlapPanelZIndex,
            left: pos.left + targetCellRef.clientWidth - 20 - 3,
          }}
        >
          {button}
        </div>
      );
    }

    return (
      <Popup
        alignX="right"
        alignY="start"
        target={targetCellRef}
        mountTo={tableWrapper || mountPoint}
        boundariesElement={targetCellRef}
        scrollableElement={scrollableElement}
        offset={[3, -3]}
        forcePlacement
        allowOutOfBounds
        zIndex={akEditorSmallZIndex}
      >
        {button}
      </Popup>
    );
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.tableNode !== nextProps.tableNode ||
      this.props.targetCellPosition !== nextProps.targetCellPosition ||
      this.props.layout !== nextProps.layout ||
      this.props.isContextualMenuOpen !== nextProps.isContextualMenuOpen ||
      this.props.isNumberColumnEnabled !== nextProps.isNumberColumnEnabled ||
      this.props.stickyHeader !== nextProps.stickyHeader
    );
  }

  private handleClick = () => {
    const { state, dispatch } = this.props.editorView;
    // Clicking outside the dropdown handles toggling the menu closed
    // (otherwise these two toggles combat each other).
    // In the event a user clicks the chevron button again
    // That will count as clicking outside the dropdown and
    // will be toggled appropriately
    if (!this.props.isContextualMenuOpen) {
      toggleContextualMenu()(state, dispatch);
    }
  };
}

export default injectIntl(FloatingContextualButton);
