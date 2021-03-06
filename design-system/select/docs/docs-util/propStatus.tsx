import React, { Component, Fragment, MouseEvent, ReactNode } from 'react';
import styled from '@emotion/styled';
import Modal, { ModalTransition, OnCloseHandler } from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button/custom-theme-button';

const Cell = styled.td`
  font-size: 90%;
  padding: 4px 8px 4px 0;
  border-bottom: 1px solid #eee;
  vertical-align: top;
`;

interface Props {
  prop: string;
  status: string;
  content: ReactNode;
}

interface State {
  modalIsOpen: boolean;
}

export default class PropStatus extends Component<Props, State> {
  state = {
    modalIsOpen: false,
  };

  onClick = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({
      modalIsOpen: true,
    });
  };

  onClose: OnCloseHandler = (event) => {
    event.preventDefault();
    this.setState({
      modalIsOpen: false,
    });
  };

  renderContent() {
    const { content, status } = this.props;

    if (status === 'renamed') {
      return <Cell>{`use ${content}`}</Cell>;
    }

    return (
      <Cell>
        {content && <Button onClick={this.onClick}>See Note</Button>}
        {this.renderModal()}
      </Cell>
    );
  }

  renderModal() {
    const { content, prop } = this.props;
    const { modalIsOpen } = this.state;

    return (
      <Fragment>
        <ModalTransition>
          {modalIsOpen ? (
            <Modal
              heading={prop}
              actions={[{ text: 'Close', onClick: this.onClose }]}
              onClose={this.onClose}
            >
              {content}
            </Modal>
          ) : null}
        </ModalTransition>
      </Fragment>
    );
  }

  render() {
    const { prop, status } = this.props;

    return (
      <tr>
        <Cell>
          <code>{prop}</code>
        </Cell>
        <Cell>{status}</Cell>
        {this.renderContent()}
      </tr>
    );
  }
}
