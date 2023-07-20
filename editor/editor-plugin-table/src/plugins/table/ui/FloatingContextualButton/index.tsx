/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';
import { Node as PMNode } from 'prosemirror-model';
import { findDomRefAtPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import { TableLayout } from '@atlaskit/adf-schema';
import {
  ACTION_SUBJECT,
  DispatchAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import { Popup } from '@atlaskit/editor-common/ui';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { akEditorSmallZIndex } from '@atlaskit/editor-shared-styles';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { ThemeProps } from '@atlaskit/theme/types';

import { toggleContextualMenu } from '../../commands';
import { RowStickyState } from '../../pm-plugins/sticky-headers';
import { TableCssClassName as ClassName } from '../../types';
import messages from '../../ui/messages';

import FixedButton from './FixedButton';
import {
  tableFloatingCellButtonSelectedStyles,
  tableFloatingCellButtonStyles,
} from './styles';

export interface Props {
  editorView: EditorView;
  tableWrapper?: HTMLElement;
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

const BUTTON_OFFSET = 3;

const FloatingContextualButtonInner = React.memo(
  (props: Props & WrappedComponentProps) => {
    const {
      editorView,
      isContextualMenuOpen,
      mountPoint,
      scrollableElement,
      stickyHeader,
      tableWrapper,
      targetCellPosition,
      intl: { formatMessage },
    } = props; //  : Props & WrappedComponentProps

    const handleClick = () => {
      const { state, dispatch } = editorView;
      // Clicking outside the dropdown handles toggling the menu closed
      // (otherwise these two toggles combat each other).
      // In the event a user clicks the chevron button again
      // That will count as clicking outside the dropdown and
      // will be toggled appropriately
      if (!isContextualMenuOpen) {
        toggleContextualMenu()(state, dispatch);
      }
    };

    const domAtPos = editorView.domAtPos.bind(editorView);
    let targetCellRef: Node | undefined;
    targetCellRef = findDomRefAtPos(targetCellPosition, domAtPos);

    if (!targetCellRef || !(targetCellRef instanceof HTMLElement)) {
      return null;
    }

    const labelCellOptions = formatMessage(messages.cellOptions);

    const button = (
      <div
        css={(theme: ThemeProps) => [
          tableFloatingCellButtonStyles({ theme }),
          isContextualMenuOpen &&
            tableFloatingCellButtonSelectedStyles({ theme }),
        ]}
      >
        <ToolbarButton
          className={ClassName.CONTEXTUAL_MENU_BUTTON}
          selected={isContextualMenuOpen}
          title={labelCellOptions}
          onClick={handleClick}
          iconBefore={<ExpandIcon label="" />}
          aria-label={labelCellOptions}
        />
      </div>
    );

    const parentSticky =
      targetCellRef.parentElement &&
      targetCellRef.parentElement.className.indexOf('sticky') > -1;
    if (stickyHeader && parentSticky && tableWrapper) {
      return (
        <FixedButton
          offset={BUTTON_OFFSET}
          stickyHeader={stickyHeader}
          tableWrapper={tableWrapper}
          targetCellPosition={targetCellPosition}
          targetCellRef={targetCellRef}
          mountTo={tableWrapper}
          isContextualMenuOpen={isContextualMenuOpen}
        >
          {button}
        </FixedButton>
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
        offset={[BUTTON_OFFSET, -BUTTON_OFFSET]}
        forcePlacement
        allowOutOfBounds
        zIndex={akEditorSmallZIndex}
      >
        {button}
      </Popup>
    );
  },
);

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
