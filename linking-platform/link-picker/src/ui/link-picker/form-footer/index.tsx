/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';
import { defineMessages, useIntl } from 'react-intl-next';

import Button, { ButtonGroup } from '@atlaskit/button';
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';

import {
  LinkPickerPluginAction,
  LinkPickerState,
  LinkSearchListItemData,
} from '../../../common/types';
import { UnauthenticatedError } from '../../../common/utils/errors';

import FeatureDiscovery from './feature-discovery';
import { formFooterActionStyles, formFooterStyles } from './styled';
import { checkSubmitDisabled } from './utils';

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
  /** Feature discovery for action button (css pulse) */
  actionButtonDiscovery: 'link-picker-action-button-discovery',
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
  createFeatureDiscovery?: boolean;
}

export const FormFooter = memo(
  ({
    isLoading,
    error,
    url,
    queryState,
    items,
    isEditing,
    onCancel,
    action,
    createFeatureDiscovery = false,
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

    const createButton = (pluginAction: LinkPickerPluginAction) => (
      <Button
        testId={testIds.actionButton}
        onClick={pluginAction.callback}
        appearance="default"
        iconBefore={<EditorAddIcon label="" size="medium" />}
      >
        {typeof pluginAction.label === 'string'
          ? pluginAction.label
          : intl.formatMessage(pluginAction.label)}
      </Button>
    );

    return (
      <footer css={formFooterStyles} {...restProps}>
        {action && (
          <div css={formFooterActionStyles}>
            {createFeatureDiscovery ? (
              <FeatureDiscovery testId={testIds.actionButtonDiscovery}>
                {createButton(action)}
              </FeatureDiscovery>
            ) : (
              createButton(action)
            )}
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
  },
);
