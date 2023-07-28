/** @jsx jsx */
import { ReactNode, useCallback } from 'react';

import { css, jsx } from '@emotion/react';
import { Form } from 'react-final-form';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { token } from '@atlaskit/tokens';

import {
  ANALYTICS_CHANNEL,
  CREATE_FORM_MAX_WIDTH_IN_PX,
} from '../../common/constants';
import { ValidatorMap } from '../../common/types';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { useFormContext } from '../../controllers/form-context';

import { CreateFormFooter } from './form-footer';
import { CreateFormLoader } from './form-loader';
import { validateFormData } from './utils';

const formStyles = css({
  maxWidth: `${CREATE_FORM_MAX_WIDTH_IN_PX}px`,
  padding: `0 0 ${token('space.300', '24px')} 0`,
  margin: `${token('space.0', '0px')} auto`,
});

export interface CreateFormProps<FormData> {
  children: ReactNode;
  testId?: string;
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  hideFooter?: boolean;
  initialValues?: FormData;
}
export const TEST_ID = 'link-create-form';

export const CreateForm = <FormData extends Record<string, any> = {}>({
  children,
  testId = TEST_ID,
  onSubmit,
  onCancel,
  isLoading,
  hideFooter,
  initialValues,
}: CreateFormProps<FormData>) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const { getValidators, formErrorMessage } = useFormContext();

  const handleSubmit = useCallback(
    async (data: FormData) => {
      createAnalyticsEvent(
        createEventPayload('ui.button.clicked.create', {}),
      ).fire(ANALYTICS_CHANNEL);

      const validators: ValidatorMap = getValidators();
      const errors = validateFormData({ data, validators });

      if (Object.keys(errors).length !== 0) {
        return errors;
      }
      return onSubmit(data);
    },
    [createAnalyticsEvent, getValidators, onSubmit],
  );

  const handleCancel = useCallback(() => {
    createAnalyticsEvent(
      createEventPayload('ui.button.clicked.cancel', {}),
    ).fire(ANALYTICS_CHANNEL);
    onCancel && onCancel();
  }, [createAnalyticsEvent, onCancel]);

  if (isLoading) {
    return <CreateFormLoader />;
  }

  return (
    <Form<FormData>
      onSubmit={handleSubmit}
      initialValues={initialValues}
      mutators={{
        setField: <K extends keyof FormData>(
          args: [K, FormData[K]],
          state: any,
          tools: any,
        ) => {
          tools.changeValue(state, args[0], () => args[1]);
        },
      }}
    >
      {({ submitting, ...formProps }) => {
        return (
          <form
            onSubmit={formProps.handleSubmit}
            name="link-create-form"
            data-testid={testId}
            css={formStyles}
          >
            <div>{children}</div>
            {!hideFooter && (
              <CreateFormFooter
                formErrorMessage={formErrorMessage}
                handleCancel={handleCancel}
                submitting={submitting}
                testId={testId}
              />
            )}
          </form>
        );
      }}
    </Form>
  );
};
