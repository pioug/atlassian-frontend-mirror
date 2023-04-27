/** @jsx jsx */
import React, { ReactNode, useCallback } from 'react';

import { jsx } from '@emotion/react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/standard-button';
import Form, { FormFooter, FormSection } from '@atlaskit/form';

import { ANALYTICS_CHANNEL } from '../../common/constants';
import { ValidatorMap } from '../../common/types';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import {
  FormContextProvider,
  useFormContext,
} from '../../controllers/form-context';

import { formStyles } from './styled';
import { validateFormData } from './utils';

export interface CreateFormProps {
  children: ReactNode;
  testId?: string;
  onCancel?: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
}

const withFormContext = (Component: React.FC<any>) => (props: any) =>
  (
    <FormContextProvider>
      <Component {...props} />
    </FormContextProvider>
  );

const CreateFormWithoutContext: React.FC<CreateFormProps> = ({
  children,
  testId,
  onCancel,
  onSubmit,
}: CreateFormProps) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const { getValidators } = useFormContext();

  const handleSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      createAnalyticsEvent(
        createEventPayload('ui.button.clicked.create', {}),
      ).fire(ANALYTICS_CHANNEL);

      const validators: ValidatorMap = getValidators();
      const errors = validateFormData({ data, validators });

      if (Object.keys(errors).length !== 0) {
        return errors;
      }
      onSubmit(data);
    },
    [createAnalyticsEvent, getValidators, onSubmit],
  );

  const handleCancel = useCallback(() => {
    createAnalyticsEvent(
      createEventPayload('ui.button.clicked.cancel', {}),
    ).fire(ANALYTICS_CHANNEL);
    onCancel && onCancel();
  }, [createAnalyticsEvent, onCancel]);

  return (
    <Form<Record<string, unknown>> onSubmit={handleSubmit}>
      {({ submitting, formProps }) => (
        <form
          {...formProps}
          name="confluence-creation-form"
          data-testid={testId}
          // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
          css={formStyles}
        >
          <FormSection>{children}</FormSection>
          <FormFooter>
            <Button
              appearance="subtle"
              onClick={handleCancel}
              testId={'cancel-button'}
            >
              Cancel
            </Button>
            <LoadingButton
              appearance="primary"
              type="submit"
              isLoading={submitting}
              testId={'create-button'}
            >
              Create
            </LoadingButton>
          </FormFooter>
        </form>
      )}
    </Form>
  );
};

export const CreateForm = withFormContext(CreateFormWithoutContext);
