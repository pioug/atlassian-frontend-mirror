/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useIntl, defineMessages } from 'react-intl-next';
import Button, { ButtonGroup } from '@atlaskit/button';

import { formFooterStyles } from './styled';
import { memo } from 'react';

const messages = defineMessages({
  cancelButton: {
    id: 'fabric.linkPicker.button.cancel',
    defaultMessage: 'Cancel',
    description: 'Button to cancel and dismiss the link picker',
  },
  saveButton: {
    id: 'fabric.linkPicker.button.save',
    defaultMessage: 'Save',
    description: 'Button to save edited link',
  },
  insertButton: {
    id: 'fabric.linkPicker.button.insert',
    defaultMessage: 'Insert',
    description: 'Button to insert searched or selected link',
  },
});

export const testIds = {
  insertButton: 'link-picker-insert-button',
  cancelButton: 'link-picker-cancel-button',
} as const;

interface FormFooterProps extends React.HTMLAttributes<HTMLElement> {
  isEditing?: boolean;
  onCancel?: () => void;
}

const FormFooter = ({ isEditing, onCancel, ...restProps }: FormFooterProps) => {
  const intl = useIntl();

  const insertButtonMsg = isEditing
    ? messages.saveButton
    : messages.insertButton;

  return (
    <footer css={formFooterStyles} {...restProps}>
      <ButtonGroup>
        <Button
          appearance="default"
          onClick={onCancel}
          testId={testIds.cancelButton}
        >
          {intl.formatMessage(messages.cancelButton)}
        </Button>
        <Button
          type="submit"
          appearance="primary"
          testId={testIds.insertButton}
        >
          {intl.formatMessage(insertButtonMsg)}
        </Button>
      </ButtonGroup>
    </footer>
  );
};

export default memo(FormFooter);
