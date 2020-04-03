import React from 'react';
import { Component } from 'react';
import { StyledIcon, StyledSvgGroup, IconProps } from './styled';

// TODO this file should be replaced with ak/icons icon MSW-404

export class GiphyIcon extends Component<IconProps, {}> {
  render() {
    const { active } = this.props;
    return (
      <StyledIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 35">
        <StyledSvgGroup active={active} fill-rule="evenodd" clip-rule="evenodd">
          <path className="logo-green" d="M0 3h4v29H0z" />
          <path className="logo-purple" d="M24 11h4v21h-4z" />
          <path className="logo-blue" d="M0 31h28v4H0z" />
          <path className="logo-yellow" d="M0 0h16v4H0z" />
          <path className="logo-red" d="M24 8V4h-4V0h-4v12h12V8" />
          <path className="logo-shadow" d="M24 16v-4h4M16 0v4h-4" />
        </StyledSvgGroup>
      </StyledIcon>
    );
  }
}
