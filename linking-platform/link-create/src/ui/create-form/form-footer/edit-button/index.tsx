import React from 'react';

import { useForm, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl-next';

import LoadingButton from '@atlaskit/button/loading-button';

import { LINK_CREATE_FORM_POST_CREATE_FIELD } from '../../../../common/constants';
import { useFormContext } from '../../../../controllers/form-context';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { FormSpy } from '../../form-spy';

import { messages } from './messages';

export const EditButton = () => {
  const intl = useIntl();
  const { submitting } = useFormState();
  const { submit, mutators } = useForm();
  const { enableEditView } = useFormContext();

  if (!enableEditView) {
    return null;
  }

  return (
    <FormSpy>
      {({ values }) => (
        <LoadingButton
          type="button"
          testId="link-create-form-button-edit"
          isLoading={
            /**
             * Should only be in a loading state if submitting is because we clicked
             * the edit button
             */
            submitting && values[LINK_CREATE_FORM_POST_CREATE_FIELD] === true
          }
          onClick={() => {
            /**
             * Setting this field to true indicates that the edit button was clicked and that
             * we have the intention of triggering the edit/post create flow
             */
            mutators.setField?.(LINK_CREATE_FORM_POST_CREATE_FIELD, true);
            submit();
          }}
        >
          {intl.formatMessage(messages.edit)}
        </LoadingButton>
      )}
    </FormSpy>
  );
};
