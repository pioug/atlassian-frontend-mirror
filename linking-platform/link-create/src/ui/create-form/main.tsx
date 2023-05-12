/** @jsx jsx */
import { ReactNode, useCallback } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { ButtonGroup } from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/standard-button';
import Form, { FormFooter, FormSection } from '@atlaskit/form';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { token } from '@atlaskit/tokens';

import {
  ANALYTICS_CHANNEL,
  CREATE_FORM_MAX_WIDTH_IN_PX,
} from '../../common/constants';
import { ValidatorMap } from '../../common/types';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { useFormContext } from '../../controllers/form-context';

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
  onCancel?: () => void;
  onSubmit: (data: FormData) => void;
}

export const CreateForm = <FormData extends Record<string, any> = {}>({
  children,
  testId,
  onCancel,
  onSubmit,
}: CreateFormProps<FormData>) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const { getValidators, formErrorMessage } = useFormContext();
  const intl = useIntl();

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
    <Form<FormData> onSubmit={handleSubmit}>
      {({ submitting, formProps }) => (
        <form
          {...formProps}
          name="confluence-creation-form"
          data-testid={testId}
          css={formStyles}
        >
          <FormSection>{children}</FormSection>
          <FormFooter>
            {formErrorMessage && (
              <div
                css={errorStyles}
                data-testid="link-create-confluence-form-error"
              >
                <ErrorIcon
                  label={formErrorMessage}
                  primaryColor={token('color.icon.danger', '#E34935')}
                />
                {formErrorMessage}
              </div>
            )}
            <ButtonGroup>
              <Button
                appearance="subtle"
                onClick={handleCancel}
                testId={'cancel-button'}
              >
                {intl.formatMessage(messages.cancel)}
              </Button>
              <LoadingButton
                appearance="primary"
                type="submit"
                isLoading={submitting}
                testId={'create-button'}
              >
                {intl.formatMessage(messages.create)}
              </LoadingButton>
            </ButtonGroup>
          </FormFooter>
        </form>
      )}
    </Form>
  );
};
