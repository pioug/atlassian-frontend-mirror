/** @jsx jsx */
import { Fragment, useCallback, useEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import DecisionIcon from '@atlaskit/icon/glyph/decision';
import Modal, {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import { paramsToObject } from '../utils';

import TokenWizardModalBody from './components/modal-body';

const ModalHeaderStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
});

/**
 * __Token wizard modal__
 *
 * A token wizard modal on the tokens reference list page.
 *
 */
const TokenWizardModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState({});
  const openModal = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    try {
      const queryString = window.location.hash
        ? window?.location?.hash?.split('?')[1]
        : window?.location?.search;
      const urlParams = new URLSearchParams(queryString);
      const entries = urlParams.entries();
      const paramInURL = paramsToObject(entries);
      setParams(paramInURL);
      setIsOpen(!!paramInURL.isTokenPickerOpen);
    } catch {
      // eslint-disable-next-line no-console
      console.error('Invalid query parameters in URL');
    }
  }, []);

  const removeParamsInUrl = useCallback(() => {
    window?.history?.pushState(
      {},
      document?.title,
      `${window?.location.pathname}${
        window?.location.hash ? window?.location.hash.split('?')[0] : ''
      }`,
    );
  }, []);

  const closeModal = () => {
    if (Object.keys(params).length) {
      setParams({});
      removeParamsInUrl();
    }
    setIsOpen(false);
  };

  return (
    <Fragment>
      <Button onClick={openModal} iconBefore={<DecisionIcon label="" />}>
        Token picker
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal
            autoFocus={false}
            onClose={closeModal}
            width="x-large"
            height={640}
          >
            <ModalHeader css={ModalHeaderStyles}>
              <ModalTitle>Token picker</ModalTitle>
              <Button
                appearance="subtle"
                iconBefore={<CrossIcon label="Close modal" size="medium" />}
                onClick={closeModal}
              />
            </ModalHeader>
            <ModalBody>
              <TokenWizardModalBody
                params={params}
                removeParamsInUrl={removeParamsInUrl}
              />
            </ModalBody>
          </Modal>
        )}
      </ModalTransition>
    </Fragment>
  );
};

export default TokenWizardModal;
