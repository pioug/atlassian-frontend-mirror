import React from 'react';
import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';
import Button, { ButtonGroup } from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme';

import { WIDTH_ENUM } from '../src/shared-variables';
import ModalDialog, { ModalTransition } from '../src';

const units = [420, '42%', '42em'];
const sizes: (string | number)[] = WIDTH_ENUM.values;
const allWidths = sizes.concat(units);
const H4 = styled.h4`
  margin-bottom: 0.66em;
`;

interface State {
  isOpen: any;
}

export default class ModalDemo extends React.Component<{}, State> {
  state = { isOpen: null };

  open = (isOpen: any) => this.setState({ isOpen });

  close = () => this.setState({ isOpen: null });

  secondaryAction = ({ currentTarget }: React.MouseEvent<HTMLElement>) =>
    console.log(currentTarget.innerText);

  render() {
    const { isOpen } = this.state;
    const btn = (name: string | number) => (
      <Button key={name} onClick={() => this.open(name)}>
        {name}
      </Button>
    );
    const actions = [
      { text: 'Close', onClick: this.close },
      { text: 'Secondary Action', onClick: this.secondaryAction },
    ];

    return (
      <div style={{ padding: gridSize() }}>
        <H4>Sizes</H4>
        <ButtonGroup>{sizes.map(btn)}</ButtonGroup>
        <H4>Units</H4>
        <ButtonGroup>{units.map(btn)}</ButtonGroup>

        <ModalTransition>
          {allWidths
            .filter((w: string | number) => w === isOpen)
            .map((name: string | number) => (
              <ModalDialog
                actions={actions}
                key={name}
                onClose={this.close}
                heading={`Modal: ${String(name)}`}
                width={name}
                {...this.props}
              >
                <Lorem count="1" />
              </ModalDialog>
            ))}
        </ModalTransition>
      </div>
    );
  }
}
