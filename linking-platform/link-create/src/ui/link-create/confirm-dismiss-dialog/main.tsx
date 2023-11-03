import React from 'react';

import { useIntl } from 'react-intl-next';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import { Button } from '../../../common/ui/Button';
import { ScreenViewedEvent } from '../../../common/utils/analytics/components';

import messages from './messages';

export type ConfirmDismissDialogProps = {
  active: boolean;
  onCancelDismiss?: () => void;
  onConfirmDismiss?: () => void;
};

const screen = 'linkCreateExitWarningScreen';

const context = { component: screen, source: screen };

export const ConfirmDismissDialog = ({
  active,
  onCancelDismiss,
  onConfirmDismiss,
}: ConfirmDismissDialogProps) => {
  const intl = useIntl();

  return (
    <ModalTransition>
      {active && (
        <AnalyticsContext data={context}>
          <Modal
            testId="link-create-confirm-dismiss-dialog"
            onClose={onCancelDismiss}
            width="small"
          >
            <ScreenViewedEvent screen="linkCreateExitWarningScreen" />
            <ModalHeader>
              <ModalTitle>{intl.formatMessage(messages.title)}</ModalTitle>
            </ModalHeader>
            <ModalBody>{intl.formatMessage(messages.description)}</ModalBody>
            <ModalFooter>
              <Button
                actionSubjectId="cancel"
                appearance="subtle"
                onClick={onCancelDismiss}
              >
                {intl.formatMessage(messages.cancelButtonLabel)}
              </Button>
              <Button
                actionSubjectId="confirm"
                appearance="primary"
                onClick={onConfirmDismiss}
              >
                {intl.formatMessage(messages.confirmButtonLabel)}
              </Button>
            </ModalFooter>
          </Modal>
        </AnalyticsContext>
      )}
    </ModalTransition>
  );
};
