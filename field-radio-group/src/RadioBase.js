/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import RadioIcon from '@atlaskit/icon/glyph/radio';

import { HiddenInput, IconWrapper, Label, Wrapper } from './styled/Radio';

export default class Radio extends Component {
  static defaultProps = {
    isDisabled: false,
    isSelected: false,
  };

  state = {
    isHovered: false,
    isFocused: false,
    isActive: false,
    mouseIsDown: false,
  };

  onBlur = () =>
    this.setState({
      // onBlur is called after onMouseDown if the checkbox was focused, however
      // in this case on blur is called immediately after, and we need to check
      // whether the mouse is down.
      isActive: this.state.mouseIsDown && this.state.isActive,
      isFocused: false,
    });

  onFocus = () => this.setState({ isFocused: true });

  onMouseLeave = () => this.setState({ isActive: false, isHovered: false });

  onMouseEnter = () => this.setState({ isHovered: true });

  onMouseUp = () => this.setState({ isActive: false, mouseIsDown: false });

  onMouseDown = () => this.setState({ isActive: true, mouseIsDown: true });

  render() {
    const {
      children,
      isDisabled,
      isRequired,
      isSelected,
      name,
      onChange,
      value,
    } = this.props;
    const { isFocused, isHovered, isActive } = this.state;

    return (
      <Label
        isDisabled={isDisabled}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
      >
        <HiddenInput
          checked={isSelected}
          disabled={isDisabled}
          name={name}
          onChange={onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          required={isRequired}
          type="radio"
          value={value}
        />
        <Wrapper>
          <IconWrapper
            isSelected={isSelected}
            isDisabled={isDisabled}
            isFocused={isFocused}
            isActive={isActive}
            isHovered={isHovered}
          >
            <RadioIcon
              primaryColor="inherit"
              secondaryColor="inherit"
              isHovered={this.state.isHovered}
              isActive={this.state.isActive}
              label=""
            />
          </IconWrapper>
          <span>{children}</span>
        </Wrapper>
      </Label>
    );
  }
}
