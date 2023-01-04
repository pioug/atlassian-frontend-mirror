import React, { useState } from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';

import Modal, {
  ModalBody,
  ModalTitle,
  ModalHeader,
  ModalFooter,
} from '@atlaskit/modal-dialog';
import messages from './messages';
import { ConfirmationDialogProps } from './types';

type ListComponentProps = {
  nodes: ConfirmDialogChildrenListItemProps[] | undefined;
};

type ConfirmDialogChildrenListItemProps = {
  id: string;
  name: string;
  amount: number;
};

export const CheckboxModal = (
  props: ConfirmationDialogProps & WrappedComponentProps,
) => {
  const [isChecked, setCheckbox] = useState(false);
  const {
    onConfirm,
    onClose,
    options,
    intl: { formatMessage },
    testId,
  } = props;

  const heading =
    options?.title || formatMessage(messages.confirmModalDefaultHeading);
  const okButtonLabel =
    options?.okButtonLabel || formatMessage(messages.confirmModalOK);
  const cancelButtonLabel =
    options?.cancelButtonLabel || formatMessage(messages.confirmModalCancel);
  const checkboxlabel = options?.checkboxLabel;

  const ListComponent = ({ nodes }: ListComponentProps) => {
    if (!nodes) {
      return null;
    }

    return (
      <ul>
        {nodes.map((node) => (
          <ListItem {...node} key={node.id} />
        ))}
      </ul>
    );
  };

  const ListItem = (props: ConfirmDialogChildrenListItemProps) => {
    const { id, name, amount } = props;
    return (
      <li id={id}>
        {formatMessage(messages.confirmModalListUnit, { name, amount })}
      </li>
    );
  };

  return (
    <Modal onClose={onClose} testId={testId}>
      <ModalHeader>
        <ModalTitle appearance="warning">{heading}</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <p>{options?.message}</p>
        {options?.getChildrenInfo && (
          <ListComponent nodes={options?.getChildrenInfo()} />
        )}
        <p>
          <Checkbox
            isChecked={isChecked}
            onChange={() => setCheckbox(!isChecked)}
            label={checkboxlabel}
            testId={testId ? `${testId}-checkbox` : undefined}
          />
        </p>
      </ModalBody>
      <ModalFooter>
        <Button
          appearance="default"
          onClick={onClose}
          testId={testId ? `${testId}-cancel-button` : undefined}
        >
          {cancelButtonLabel}
        </Button>
        <Button
          appearance="warning"
          onClick={() => onConfirm(isChecked)}
          testId={testId ? `${testId}-confirm-button` : undefined}
        >
          {okButtonLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
