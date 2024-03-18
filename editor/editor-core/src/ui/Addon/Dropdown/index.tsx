/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import type EditorActions from '../../../actions';
import type { RenderOnClickHandler } from '../../Addon/types';
import type { AddonActions } from '../types';

import { dropdown } from './styles';

export interface Props {
  children?: React.ReactNode;
  onClick: (
    actionOnClick: EditorActions,
    renderOnClick: RenderOnClickHandler,
  ) => void;
  editorActions: EditorActions;
  togglePopup: () => void;
}

export default class DropdownWrapper extends React.Component<Props, any> {
  render() {
    // adding onClick handler to each DropdownItem component
    const children = React.Children.map(this.props.children, (child) =>
      React.cloneElement(child as React.ReactElement<any>, {
        onClick: this.handleClick,
      }),
    );

    return <div css={dropdown}>{children}</div>;
  }

  private handleClick = (actions: AddonActions) => {
    const { actionOnClick, renderOnClick } = actions;
    const { editorActions } = this.props;
    if (actionOnClick) {
      actionOnClick(editorActions);
      this.props.togglePopup();
    } else if (renderOnClick) {
      this.props.onClick(editorActions, renderOnClick);
    }
  };
}
