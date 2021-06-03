import React, { Component, Fragment } from 'react';

import styled from 'styled-components';

import { DropdownItem, DropdownItemGroup, DropdownMenuStateless } from '../src';

const Description = styled.p`
  margin-bottom: 16px;
`;

const CoordWrapper = styled.div`
  margin-bottom: 16px;
`;

type Position = { x: number; y: number };
type State = {
  beforePosition: Position;
  afterPosition: Position;
};

export default class PositionCallbackExample extends Component<{}, State> {
  state = {
    beforePosition: { x: 0, y: 0 },
    afterPosition: { x: 0, y: 0 },
  };

  ref: HTMLElement | null = null;

  componentDidMount() {
    if (this.ref) {
      const position = this.ref.getBoundingClientRect();
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ beforePosition: { x: position.left, y: position.top } });
    }
  }

  onPositioned = () => {
    if (this.ref) {
      const position = this.ref.getBoundingClientRect();
      this.setState({ afterPosition: { x: position.left, y: position.top } });
    }
  };

  render() {
    const { beforePosition, afterPosition } = this.state;

    return (
      <Fragment>
        <Description>
          The values below are the co-ordinates of the dropdown content before
          and after it is positioned by layer.
          <br />
          There may be some rare use cases where the content would need to defer
          some handling until after this occurs.
          <br />
        </Description>
        <CoordWrapper>
          <p>{`Before onPositioned called - x: ${beforePosition.x}, y: ${beforePosition.y}`}</p>
          <p>{`After onPositioned called - x: ${afterPosition.x}, y: ${afterPosition.y}`}</p>
        </CoordWrapper>
        <DropdownMenuStateless
          triggerType="button"
          trigger="Page action"
          isOpen
          onPositioned={this.onPositioned}
        >
          <div
            ref={(elem) => {
              this.ref = elem;
            }}
          >
            <DropdownItemGroup>
              <DropdownItem>Move</DropdownItem>
              <DropdownItem>Clone</DropdownItem>
              <DropdownItem>Delete</DropdownItem>
            </DropdownItemGroup>
          </div>
        </DropdownMenuStateless>
      </Fragment>
    );
  }
}
