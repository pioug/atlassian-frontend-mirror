import React from 'react';
import { EditorView } from 'prosemirror-view';
import { Popup } from '@atlaskit/editor-common';
import { TableLayout } from '@atlaskit/adf-schema';
import { findDomRefAtPos } from 'prosemirror-utils';
import styled from 'styled-components';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { tableFloatingCellButtonStyles } from '../styles';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { TableCssClassName as ClassName } from '../../types';
import messages from '../../ui/messages';
import { toggleContextualMenu } from '../../commands';
import { closestElement } from '../../../../utils/dom';

export interface Props {
  editorView: EditorView;
  targetCellPosition: number;
  isContextualMenuOpen?: boolean;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  layout?: TableLayout;
  isNumberColumnEnabled?: boolean;
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
      >
        <ButtonWrapper>
          <ToolbarButton
            className={ClassName.CONTEXTUAL_MENU_BUTTON}
            selected={isContextualMenuOpen}
            title={labelCellOptions}
            onClick={this.handleClick}
            iconBefore={<ExpandIcon label={labelCellOptions} />}
          />
        </ButtonWrapper>
      </Popup>
    );
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.targetCellPosition !== nextProps.targetCellPosition ||
      this.props.layout !== nextProps.layout ||
      this.props.isContextualMenuOpen !== nextProps.isContextualMenuOpen ||
      this.props.isNumberColumnEnabled !== nextProps.isNumberColumnEnabled
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
