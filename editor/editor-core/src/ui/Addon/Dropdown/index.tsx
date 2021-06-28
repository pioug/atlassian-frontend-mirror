import React from 'react';
import { Dropdown } from './styles';
import { RenderOnClickHandler } from '../../Addon/types';
import EditorActions from '../../../actions';
import { AddonActions } from '../types';

export interface Props {
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

    return <Dropdown>{children}</Dropdown>;
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
