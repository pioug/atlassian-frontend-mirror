import React, { Component, ElementType, RefObject } from 'react';
import styled from 'styled-components';

import Textfield from '@atlaskit/textfield';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Tooltip from '@atlaskit/tooltip';
import { colors, gridSize } from '@atlaskit/theme';

const IconExplorerLink = styled.a`
  &,
  &:hover,
  &:active,
  &:focus {
    border-radius: ${gridSize() / 2}px;
    color: inherit;
    cursor: pointer;
    display: block;
    line-height: 0;
    padding: 10px;
  }

  &:hover {
    background: ${colors.N30A};
  }
`;

const IconModalHeader = styled.h3`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
`;

interface Props {
  keywords: string[];
  component: ElementType;
  componentName: string;
  package: string;
}

class IconExplorerCell extends Component<Props, { isModalOpen: boolean }> {
  state = {
    isModalOpen: false,
  };

  ref: HTMLElement | null = null;
  input: HTMLInputElement | null = null;
  importCodeField: HTMLElement | null = null;

  setInputRef = (ref: RefObject<HTMLInputElement>) => {
    const isSet = Boolean(this.ref);

    console.log(ref);

    this.input = ref ? ref.current : null;

    if (this.input && !isSet) {
      this.input.select();
    }
  };

  copyToClipboard = () => {
    if (!this.state.isModalOpen || !this.input) {
      return;
    }

    try {
      this.input.select();
      const wasCopied = document.execCommand('copy');

      if (!wasCopied) {
        throw new Error();
      }
    } catch (err) {
      console.error('Unable to copy text');
    }
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  render() {
    const { component: Icon, ...props } = this.props;

    const modal = (
      <ModalTransition>
        {this.state.isModalOpen ? (
          <Modal
            onClose={this.closeModal}
            components={{
              Header: () => (
                <IconModalHeader>
                  <Icon label={props.componentName} size="medium" />
                  {props.componentName}
                </IconModalHeader>
              ),
            }}
            actions={[
              {
                text: 'Copy',
                onClick: this.copyToClipboard,
              },
              {
                text: 'Close',
                onClick: this.closeModal,
              },
            ]}
          >
            {/* eslint-disable jsx-a11y/no-static-element-interactions */}
            <div
              onClick={() => this.input && this.input.select()}
              ref={ref => {
                this.importCodeField = ref;
              }}
              role="presentation"
            >
              <Textfield
                isReadOnly
                value={`import ${props.componentName} from '${props.package}';`}
                ref={this.setInputRef}
              />
            </div>
            {/* eslint-enable jsx-a11y/no-static-element-interactions */}
          </Modal>
        ) : null}
      </ModalTransition>
    );

    return (
      <div>
        <Tooltip content={props.componentName}>
          <IconExplorerLink onClick={this.openModal}>
            <Icon label={props.componentName} />
          </IconExplorerLink>
        </Tooltip>
        {modal}
      </div>
    );
  }
}

export default IconExplorerCell;
