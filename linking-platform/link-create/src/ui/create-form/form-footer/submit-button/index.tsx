import React from 'react';

import { useForm, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl-next';

import LoadingButton from '@atlaskit/button/loading-button';

import { LINK_CREATE_FORM_POST_CREATE_FIELD } from '../../../../common/constants';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { FormSpy } from '../../form-spy';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { messages } from '../messages';

export const SubmitButton = () => {
  const intl = useIntl();
  const { submitting } = useFormState();
  const { mutators } = useForm();

  return (
    <FormSpy>
      {({ values }) => (
        <LoadingButton
          type="submit"
          appearance="primary"
          isLoading={
            /**
             * Should only be in a loading state if submitting is because we clicked
             * the edit button
             */
            submitting && values[LINK_CREATE_FORM_POST_CREATE_FIELD] === false
          }
          testId="link-create-form-button-submit"
          onClick={() => {
            mutators.setField?.(LINK_CREATE_FORM_POST_CREATE_FIELD, false);
          }}
        >
          {intl.formatMessage(messages.create)}
        </LoadingButton>
      )}
    </FormSpy>
  );
};
