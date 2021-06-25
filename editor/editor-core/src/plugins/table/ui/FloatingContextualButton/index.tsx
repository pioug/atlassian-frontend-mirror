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
import {
  DispatchAnalyticsEvent,
  AnalyticsEventPayload,
  CONTENT_COMPONENT,
} from '../../../analytics/types';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../../analytics';
import { tableFloatingCellButtonStyles } from './styles.css';
import { Node as PMNode } from 'prosemirror-model';
import { ErrorBoundary } from '../../../../ui/ErrorBoundary';

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
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}

const ButtonWrapper = styled.div`
  ${tableFloatingCellButtonStyles}
`;

export class FloatingContextualButtonInner extends React.Component<
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
      dispatchAnalyticsEvent,
    } = this.props; //  : Props & InjectedIntlProps
    const domAtPos = editorView.domAtPos.bind(editorView);
    let targetCellRef: Node | undefined;
    try {
      targetCellRef = findDomRefAtPos(targetCellPosition, domAtPos);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      if (dispatchAnalyticsEvent) {
        const payload: AnalyticsEventPayload = {
          action: ACTION.ERRORED,
          actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: {
            component: CONTENT_COMPONENT.FLOATING_CONTEXTUAL_BUTTON,
            selection: editorView.state.selection.toJSON(),
            position: targetCellPosition,
            docSize: editorView.state.doc.nodeSize,
            error: error.toString(),
            errorStack: error.stack || undefined,
          },
        };
        dispatchAnalyticsEvent(payload);
      }
    }

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

const FloatingContextualButton = injectIntl(FloatingContextualButtonInner);

export default function (props: Props) {
  return (
    <ErrorBoundary
      component={ACTION_SUBJECT.FLOATING_CONTEXTUAL_BUTTON}
      dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
      fallbackComponent={null}
    >
      <FloatingContextualButton {...props} />
    </ErrorBoundary>
  );
}
