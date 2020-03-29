import React from 'react';
import styled from '@emotion/styled';
import Button, { ButtonGroup } from '@atlaskit/button';
import ModalDialog, { ModalTransition } from '../src';

const H4 = styled.h4`
  margin-bottom: 0.66em;
`;

interface StubDialogProps {
  children: React.ReactNode;
  heading?: string;
  autoFocus?: boolean;
}

interface State {
  isOpen: string | null;
}

/* eslint-disable jsx-a11y/no-autofocus */
export default class ModalDemo extends React.Component<{}, State> {
  state = { isOpen: null };

  open = (isOpen: string) => this.setState({ isOpen });

  close = () => this.setState({ isOpen: null });

  secondaryAction = ({ currentTarget }: React.MouseEvent<HTMLElement>) =>
    console.log(currentTarget.innerText);

  render() {
    const { isOpen } = this.state;
    const actions = [
      { text: 'Close', onClick: this.close },
      { text: 'Secondary Action', onClick: this.secondaryAction },
    ];
    const StubDialog = ({ children, ...props }: StubDialogProps) => (
      <ModalDialog actions={actions} onClose={this.close} {...props}>
        {children}
      </ModalDialog>
    );

    return (
      <div style={{ padding: 16 }}>
        <H4>Variants</H4>
        <ButtonGroup>
          <Button onClick={() => this.open('root')}>Boolean on dialog</Button>
          <Button onClick={() => this.open('autoFocus')}>
            using autoFocus attribute
          </Button>
        </ButtonGroup>

        <p>
          When boolean applied to the dialog, we search inside for tabbable
          elements.
        </p>
        <p>
          The autoFocus property must be a function rather the node itself so
          its evaluated at the right time and ensures a node is returned.
        </p>

        <ModalTransition>
          {isOpen === 'root' && (
            <StubDialog autoFocus heading="Boolean on dialog">
              <p>The first {'"tabbable"'} element will be focused.</p>
              <button>I am focused!</button>
              <button>I am NOT focused</button>
            </StubDialog>
          )}
        </ModalTransition>
        <ModalTransition>
          {isOpen === 'autoFocus' && (
            <StubDialog heading="input has autoFocus">
              <p>The textbox should be focused</p>
              <input autoFocus type="text" />
            </StubDialog>
          )}
        </ModalTransition>
      </div>
    );
  }
}
