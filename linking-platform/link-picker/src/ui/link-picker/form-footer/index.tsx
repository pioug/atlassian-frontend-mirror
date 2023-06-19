/** @jsx jsx */
import { jsx } from '@emotion/react';
import { memo } from 'react';
import { useIntl, defineMessages } from 'react-intl-next';
import Button, { ButtonGroup } from '@atlaskit/button';
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';

import { formFooterStyles, formFooterActionStyles } from './styled';
import { checkSubmitDisabled } from './utils';
import {
  LinkPickerPluginAction,
  LinkPickerState,
  LinkSearchListItemData,
} from '../../types';
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
  actionButton: 'link-picker-action-button',
} as const;

interface FormFooterProps extends React.HTMLAttributes<HTMLElement> {
  /** If the results section appears to be loading, impact whether the submit button is disabled */
  isLoading: boolean;
  error: unknown | null;
  url: string;
  queryState: LinkPickerState | null;
  items: LinkSearchListItemData[] | null;
  isEditing?: boolean;
  onCancel?: () => void;
  action?: LinkPickerPluginAction;
}

const FormFooter = ({
  isLoading,
  error,
  url,
  queryState,
  items,
  isEditing,
  onCancel,
  action,
  ...restProps
}: FormFooterProps) => {
  const intl = useIntl();

  if (error && error instanceof UnauthenticatedError) {
    return null;
  }

  const isSubmitDisabled = checkSubmitDisabled(
    isLoading,
    error,
    url,
    queryState,
    items,
  );

  const insertButtonMsg = isEditing
    ? messages.saveButton
    : messages.insertButton;

  return (
    <footer css={formFooterStyles} {...restProps}>
      {action && (
        <div css={formFooterActionStyles}>
          <Button
            testId={testIds.actionButton}
            onClick={action.callback}
            appearance="default"
            iconBefore={<EditorAddIcon label="" size="medium" />}
          >
            {typeof action.label === 'string'
              ? action.label
              : intl.formatMessage(action.label)}
          </Button>
        </div>
      )}
      <ButtonGroup>
        <Button
          appearance="subtle"
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
