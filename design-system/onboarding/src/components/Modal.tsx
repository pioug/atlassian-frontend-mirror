import React, { Component, ElementType, ReactNode } from 'react';

import Button, {
  Theme as ButtonTheme,
} from '@atlaskit/button/custom-theme-button';
import Modal, {
  FooterComponentProps,
  HeaderComponentProps,
} from '@atlaskit/modal-dialog';

import {
  ActionItem,
  Body,
  Heading,
  Image,
  Actions as ModalActions,
} from '../styled/Modal';
import { Actions } from '../types';

import { modalButtonTheme } from './theme';

type Props = {
  /** Buttons to render in the footer */
  actions?: Actions;
  /** The elements rendered in the modal */
  children: ReactNode;
  /** Path to the the your image */
  image?: string;
  /** Optional element rendered above the body */
  header?: ElementType<HeaderComponentProps>;
  /** Optional element rendered below the body */
  footer?: ElementType<FooterComponentProps>;
  /** Heading text rendered above the body */
  heading?: string;
  /** Boolean prop to confirm if primary button in the footer should be shown on the right  */
  experimental_shouldShowPrimaryButtonOnRight?: boolean;
};

function noop() {}

export default class OnboardingModal extends Component<Props> {
  headerComponent = (props: Props) => {
    const { header: HeaderElement, image: src } = props;

    const ImageElement = () => <Image alt="" src={src} />;

    return HeaderElement || ImageElement;
  };

  footerComponent = (props: Props) => {
    const {
      footer: FooterElement,
      actions: actionList,
      experimental_shouldShowPrimaryButtonOnRight = false,
    } = props;

    const ActionsElement = () =>
      actionList ? (
        <ButtonTheme.Provider value={modalButtonTheme}>
          <ModalActions
            shouldReverseButtonOrder={
              experimental_shouldShowPrimaryButtonOnRight
            }
          >
            {actionList.map(({ text, key, ...rest }, idx) => {
              const variant = idx ? 'subtle-link' : 'primary';
              return (
                <ActionItem
                  key={key || (typeof text === 'string' ? text : `${idx}`)}
                >
                  <Button appearance={variant} autoFocus={!idx} {...rest}>
                    {text}
                  </Button>
                </ActionItem>
              );
            })}
          </ModalActions>
        </ButtonTheme.Provider>
      ) : null;

    return FooterElement || ActionsElement;
  };

  render() {
    const { actions, children, heading, ...props } = this.props;

    return (
      <Modal
        autoFocus
        components={{
          Header: this.headerComponent(this.props),
          Footer: this.footerComponent(this.props),
        }}
        onClose={noop}
        scrollBehavior="outside"
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEscapePress={false}
        {...props}
      >
        <Body>
          {heading && <Heading>{heading}</Heading>}
          {children}
        </Body>
      </Modal>
    );
  }
}
