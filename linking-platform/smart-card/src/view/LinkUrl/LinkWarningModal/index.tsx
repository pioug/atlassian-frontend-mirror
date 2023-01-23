import React, { FC } from 'react';
import Button from '@atlaskit/button/standard-button';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import {
  FormattedMessage,
  IntlProvider,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';

import { messages } from '../../../messages';

interface LinkWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  unsafeLinkText: string | null;
  url: string | null;
}

const WarningModal: FC<LinkWarningModalProps & WrappedComponentProps> = (
  props,
) => {
  const { isOpen, unsafeLinkText, url, onClose, onContinue, intl } = props;

  const content = (
    <ModalTransition>
      {isOpen && (
        <Modal onClose={onClose} testId="link-with-safety-warning">
          <ModalHeader>
            <ModalTitle appearance="warning">
              <FormattedMessage {...messages.check_this_link} />
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            {url && unsafeLinkText && (
              <FormattedMessage
                {...messages.link_safety_warning_message}
                values={{
                  unsafeLinkText: unsafeLinkText,
                  a: () => (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  ),
                }}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button appearance="subtle" onClick={onClose}>
              <FormattedMessage {...messages.go_back} />
            </Button>
            <Button appearance="warning" onClick={onContinue} autoFocus>
              <FormattedMessage {...messages.continue} />
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTransition>
  );

  return intl ? content : <IntlProvider locale="en">{content}</IntlProvider>;
};

export default injectIntl(WarningModal, {
  enforceContext: false,
});
