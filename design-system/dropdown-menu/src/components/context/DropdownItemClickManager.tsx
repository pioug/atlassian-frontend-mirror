import { Component, KeyboardEvent, MouseEvent, ReactNode } from 'react';

import PropTypes from 'prop-types';

import { clickManagerContext } from '../../util/contextNamespace';

interface Props {
  children?: ReactNode;
  onItemClicked: (event: MouseEvent | KeyboardEvent) => void;
}

export default class DropdownItemClickManager extends Component<Props> {
  static childContextTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    [clickManagerContext]: PropTypes.object,
  };

  getChildContext() {
    return {
      [clickManagerContext]: {
        itemClicked: this.handleItemClicked,
      },
    };
  }

  handleItemClicked = (event: any) => {
    this.props.onItemClicked(event);
  };

  render() {
    return this.props.children;
  }
}
