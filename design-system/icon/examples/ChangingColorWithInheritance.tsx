import React, { Component } from 'react';
import { colors } from '@atlaskit/theme';
import styled from 'styled-components';
import Button from '@atlaskit/button';

import BookIcon from '../glyph/book';
import ArrowUpIcon from '../glyph/arrow-up';
import ArrowDownIcon from '../glyph/arrow-down';
import ArrowLeftIcon from '../glyph/arrow-left';
import ArrowRightIcon from '../glyph/arrow-right';

const ColorDiv = styled.div<{ isColorFlipped: boolean }>`
  align-items: center;
  color: ${props => (props.isColorFlipped ? colors.N300 : 'white')};
  background-color: ${props => (props.isColorFlipped ? 'white' : colors.B500)};
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  justify-content: center;
  /* transition: color 0.2s, background-color 0.2s; */
`;

const Paragraph = styled.p<{ isColorFlipped: boolean }>`
  flex-basis: 100%;
  text-align: center;
  color: ${props => (props.isColorFlipped ? 'inherit' : 'white')};
`;

export default class ChangingColorWithInheritance extends Component<
  {},
  { isColorFlipped: boolean }
> {
  state = {
    isColorFlipped: false,
  };

  onToggleClick = () => {
    this.flipColor();
  };

  flipColor = () => {
    this.setState({ isColorFlipped: !this.state.isColorFlipped });
  };

  render() {
    return (
      <ColorDiv isColorFlipped={this.state.isColorFlipped}>
        <Paragraph isColorFlipped={this.state.isColorFlipped}>
          Icons inherit color from their parent by default.
        </Paragraph>
        <BookIcon label="book" />
        <ArrowUpIcon label="arrowup" />
        <ArrowDownIcon label="arrowdown" />
        <ArrowLeftIcon label="arrowleft" />
        <ArrowRightIcon label="arrowright" />
        <Paragraph isColorFlipped={this.state.isColorFlipped}>
          <Button appearance="subtle-link" onClick={this.onToggleClick}>
            Change colour
          </Button>
        </Paragraph>
      </ColorDiv>
    );
  }
}
