/** @jsx jsx */
import { jsx } from '@emotion/react';
import { memo } from 'react';
import { useIntl, defineMessages } from 'react-intl-next';
import Button, { ButtonGroup } from '@atlaskit/button';

import { formFooterStyles } from './styled';
import { checkSubmitDisabled } from './utils';
import { LinkPickerState, LinkSearchListItemData } from '../../types';
import { UnauthenticatedError } from '../../../common/utils/errors';

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
  isLoading: boolean;
  error: unknown | null;
  state: LinkPickerState | null;
  items: LinkSearchListItemData[] | null;
  isEditing?: boolean;
  onCancel?: () => void;
}

const FormFooter = ({
  isLoading,
  error,
  state,
  items,
  isEditing,
  onCancel,
  ...restProps
}: FormFooterProps) => {
  const intl = useIntl();

  if (error && error instanceof UnauthenticatedError) {
    return null;
  }

  const isSubmitDisabled = checkSubmitDisabled(isLoading, error, state, items);

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
          isDisabled={isSubmitDisabled}
        >
          {intl.formatMessage(insertButtonMsg)}
        </Button>
      </ButtonGroup>
    </footer>
  );
};

export default memo(FormFooter);
