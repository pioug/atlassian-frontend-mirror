/** @jsx jsx */
import { ReactNode, useCallback } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { ButtonGroup } from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/standard-button';
import Form, { FormFooter } from '@atlaskit/form';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { token } from '@atlaskit/tokens';

import {
  ANALYTICS_CHANNEL,
  CREATE_FORM_MAX_WIDTH_IN_PX,
} from '../../common/constants';
import { ValidatorMap } from '../../common/types';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { useFormContext } from '../../controllers/form-context';

import { CreateFormLoader } from './form-loader';
import { messages } from './messages';
import { validateFormData } from './utils';

const formStyles = css({
  maxWidth: `${CREATE_FORM_MAX_WIDTH_IN_PX}px`,
  padding: `0 0 ${token('space.300', '24px')} 0`,
  margin: `${token('space.0', '0px')} auto`,
});

const errorStyles = css({
  display: 'flex',
  alignItems: 'center',
  marginRight: 'auto',
});

export interface CreateFormProps<FormData> {
  children: ReactNode;
  testId?: string;
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  hideFooter?: boolean;
}

export const TEST_ID = 'link-create-form';

export const CreateForm = <FormData extends Record<string, any> = {}>({
  children,
  testId = TEST_ID,
  onSubmit,
  onCancel,
  isLoading,
  hideFooter,
}: CreateFormProps<FormData>) => {
  const intl = useIntl();
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
    <Form<FormData> onSubmit={handleSubmit}>
      {({ formProps, submitting }) => (
        <form
          {...formProps}
          name="link-create-form"
          data-testid={testId}
          css={formStyles}
        >
          <div>{children}</div>
          {!hideFooter && (
            <FormFooter>
              {formErrorMessage && (
                <div css={errorStyles} data-testid={`${testId}-error`}>
                  <ErrorIcon
                    label={formErrorMessage}
                    primaryColor={token('color.icon.danger', '#E34935')}
                  />
                  {formErrorMessage}
                </div>
              )}
              <ButtonGroup>
                <Button
                  type="button"
                  appearance="subtle"
                  onClick={handleCancel}
                  testId={`${testId}-button-cancel`}
                >
                  {intl.formatMessage(messages.close)}
                </Button>
                <LoadingButton
                  type="submit"
                  appearance="primary"
                  isLoading={submitting}
                  testId={`${testId}-button-submit`}
                >
                  {intl.formatMessage(messages.create)}
                </LoadingButton>
              </ButtonGroup>
            </FormFooter>
          )}
        </form>
      )}
    </Form>
  );
};
