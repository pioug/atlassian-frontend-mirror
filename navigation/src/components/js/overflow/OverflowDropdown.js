import React, { Component } from 'react';

import { ThemeProvider } from 'styled-components';
import DropdownMenu from '@atlaskit/dropdown-menu';
import Item from '@atlaskit/item';
import MoreVerticalIcon from '@atlaskit/icon/glyph/more-vertical';
import Tooltip from '@atlaskit/tooltip';
import OverflowDropdownButtonWrapper from '../../styled/OverflowDropdownButtonWrapper';
import { isDropdownOverflowKey } from '../../../theme/util';

const theme = {
  [isDropdownOverflowKey]: true,
};

export default class OverflowDropdown extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { isOpen: false };
  }

  handleDropdownToggle = ({ isOpen }) => {
    this.setState({ isOpen });
  };

  render() {
    // The OverflowDropdownButtonWrapper is used to control the width of the button, because
    // setting DropdownMenu.shouldFitContainer causes the dropdown layer to receive the same
    // constrained width as the button, which is way too small. This can be fixed in the
    // @atlaskit/dropdown-menu component then OverflowDropdownButtonWrapper can be removed.
    const dropdownTrigger = (
      <OverflowDropdownButtonWrapper>
        <Item aria-haspopup="true" aria-expanded={this.state.isOpen}>
          <MoreVerticalIcon size="small" label="More items" />
        </Item>
      </OverflowDropdownButtonWrapper>
    );

    return (
      <ThemeProvider theme={theme}>
        <DropdownMenu
          onOpenChange={this.handleDropdownToggle}
          shouldFlip={false}
          trigger={
            this.state.isOpen ? (
              dropdownTrigger
            ) : (
              <Tooltip content="Show more" position="right">
                {dropdownTrigger}
              </Tooltip>
            )
          }
          position="right bottom"
        >
          {this.props.children}
        </DropdownMenu>
      </ThemeProvider>
    );
  }
}
