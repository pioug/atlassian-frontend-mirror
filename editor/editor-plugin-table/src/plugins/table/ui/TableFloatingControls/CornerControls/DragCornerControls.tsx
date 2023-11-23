import React, { useMemo } from 'react';

import classnames from 'classnames';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
  findTable,
  isTableSelected,
  selectTable,
} from '@atlaskit/editor-tables/utils';

import { clearHoverSelection } from '../../../commands';
import { TableCssClassName as ClassName } from '../../../types';

import type { CornerControlProps } from './types';

const DragCornerControlsComponent = ({
  editorView,
  isInDanger,
  intl: { formatMessage },
}: CornerControlProps & WrappedComponentProps) => {
  const handleOnClick = () => {
    const { state, dispatch } = editorView;
    dispatch(selectTable(state.tr).setMeta('addToHistory', false));
  };

  const handleMouseOut = () => {
    const { state, dispatch } = editorView;
    clearHoverSelection()(state, dispatch);
  };

  const isActive = useMemo(() => {
    const { selection } = editorView.state;
    const table = findTable(selection);
    if (!table) {
      return false;
    }
    return isTableSelected(selection);
  }, [editorView.state]);

  return (
    <button
      className={classnames(ClassName.DRAG_CORNER_BUTTON, {
        active: isActive,
        danger: isActive && isInDanger,
      })}
      aria-label={formatMessage(messages.cornerControl)}
      type="button"
      onClick={handleOnClick}
      onMouseOut={handleMouseOut}
      contentEditable={false}
    >
      <div className={ClassName.DRAG_CORNER_BUTTON_INNER} />
    </button>
  );
};

export const DragCornerControls = injectIntl(DragCornerControlsComponent);
