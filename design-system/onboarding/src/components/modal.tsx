/** @jsx jsx */
import { Component, ElementType, ReactNode } from 'react';

import { jsx } from '@emotion/core';

import Button, {
  Theme as ButtonTheme,
} from '@atlaskit/button/custom-theme-button';
import Modal, {
  ModalFooterProps as FooterComponentProps,
  ModalHeaderProps as HeaderComponentProps,
  ModalBody,
} from '@atlaskit/modal-dialog';

import {
  ModalBody as Body,
  ModalHeading as Heading,
  ModalActionContainer,
  ModalActionItem,
  ModalImage,
} from '../styled/modal';
import { Actions } from '../types';

import { modalButtonTheme } from './theme';

// TODO: DSP-1250 - use a composable API consistent with normal modal dialog
type ModalProps = {
  /**
   * Buttons to render in the footer
   */
  actions?: Actions;
  /**
   * The elements rendered in the modal
   */
  children: ReactNode;
  /**
   * Path to the the your image
   */
  image?: string;
  /**
   * Optional element rendered above the body
   */
  header?: ElementType<HeaderComponentProps>;
  /**
   * Optional element rendered below the body
   */
  footer?: ElementType<FooterComponentProps>;
  /**
   * Heading text rendered above the body
   */
  heading?: string;
  /**
   * Boolean prop to confirm if primary button in the footer should be shown on the right
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  experimental_shouldShowPrimaryButtonOnRight?: boolean;
};

function noop() {}

/**
 * __Onboarding modal__
 *
 * If the product change is large enough,
 * this component can be used to outline the benefits of the change to the user.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/onboarding)
 */
export default class OnboardingModal extends Component<ModalProps> {
  headerComponent = (props: ModalProps) => {
    const { header: HeaderElement, image: src } = props;

    const ImageElement = () => <ModalImage src={src} alt="" />;

    return HeaderElement || ImageElement;
  };

  footerComponent = (props: ModalProps) => {
    const {
      footer: FooterElement,
      actions: actionList,
      experimental_shouldShowPrimaryButtonOnRight = false,
    } = props;

    const ActionsElement = () =>
      actionList ? (
        <ButtonTheme.Provider value={modalButtonTheme}>
          <ModalActionContainer
            shouldReverseButtonOrder={
              experimental_shouldShowPrimaryButtonOnRight
            }
          >
            {actionList.map(({ text, key, ...rest }, idx) => {
              const variant = idx ? 'subtle-link' : 'primary';
              return (
                <ModalActionItem
                  key={key || (typeof text === 'string' ? text : `${idx}`)}
                >
                  <Button appearance={variant} autoFocus={!idx} {...rest}>
                    {text}
                  </Button>
                </ModalActionItem>
              );
            })}
          </ModalActionContainer>
        </ButtonTheme.Provider>
      ) : null;

    return FooterElement || ActionsElement;
  };

  render() {
    const { actions, children, heading, ...props } = this.props;

    const Header = this.headerComponent(this.props);
    const Footer = this.footerComponent(this.props);

    return (
      <Modal
        autoFocus
        onClose={noop}
        shouldScrollInViewport
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEscapePress={false}
        {...props}
      >
        <Header />
        <ModalBody>
          <Body>
            {heading && <Heading>{heading}</Heading>}
            {children}
          </Body>
        </ModalBody>
        <Footer />
      </Modal>
    );
  }
}
