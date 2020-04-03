import React, { Component, ComponentType } from 'react';
import { colors } from '@atlaskit/theme';
import styled from 'styled-components';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button';
import BookIcon from '../glyph/book';
import ArrowUpIcon from '../glyph/arrow-up';
import ArrowDownIcon from '../glyph/arrow-down';
import ArrowLeftIcon from '../glyph/arrow-left';
import ArrowRightIcon from '../glyph/arrow-right';

const ColorDiv = styled.div<{ isColorFlipped: boolean }>`
  align-items: center;
  background-color: ${props => (props.isColorFlipped ? 'white' : colors.B500)};
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  justify-content: center;
  transition: color 0.2s, background-color 0.2s;
`;

const Paragraph = styled.p<{ isColorFlipped: boolean }>`
  flex-basis: 100%;
  text-align: center;
  color: ${props => (props.isColorFlipped ? 'inherit' : 'white')};
`;

interface State {
  isColorFlipped: boolean;
  icons: [ComponentType<any>, string][];
}

export default class ChangingColorWithProps extends Component<{}, State> {
  readonly state: State = {
    isColorFlipped: true,
    icons: [
      [BookIcon, 'BookIcon'],
      [ArrowUpIcon, 'ArrowUpIcon'],
      [ArrowDownIcon, 'ArrowDownIcon'],
      [ArrowLeftIcon, 'ArrowLeftIcon'],
      [ArrowRightIcon, 'ArrowRightIcon'],
    ],
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
          Icon colors can be set via the primaryColor and secondaryColor props.
        </Paragraph>
        {this.state.icons.map(([Icon, label]) => (
          <Tooltip content={label} key={label}>
            <Icon
              primaryColor={this.state.isColorFlipped ? colors.N300 : 'white'}
              size="xlarge"
              label={label}
            />
          </Tooltip>
        ))}
        <Paragraph isColorFlipped={this.state.isColorFlipped}>
          <Button appearance="subtle-link" onClick={this.onToggleClick}>
            Change colour
          </Button>
        </Paragraph>
      </ColorDiv>
    );
  }
}
