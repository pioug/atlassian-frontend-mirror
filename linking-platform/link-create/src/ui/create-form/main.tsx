/** @jsx jsx */
import { ReactNode, useCallback } from 'react';

import { css, jsx } from '@emotion/react';
import { MutableState, Tools } from 'final-form';
import { Form, FormSpy } from 'react-final-form';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import {
  ANALYTICS_CHANNEL,
  CREATE_FORM_MAX_WIDTH_IN_PX,
  LINK_CREATE_FORM_POST_CREATE_FIELD,
} from '../../common/constants';
import { ValidatorMap } from '../../common/types';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { useExitWarningModal } from '../../controllers/exit-warning-modal-context';
import { useFormContext } from '../../controllers/form-context';

import { CreateFormFooter } from './form-footer';
import { CreateFormLoader } from './form-loader';
import { validateFormData } from './utils';

const formStyles = css({
  maxWidth: `${CREATE_FORM_MAX_WIDTH_IN_PX}px`,
  padding: `0 0 ${token('space.300', '24px')} 0`,
  margin: `${token('space.0', '0px')} auto`,
});

type ReservedFields = {
  [Field in (typeof RESERVED_FIELDS)[number]]?: unknown;
};

type WithReservedFields<T> = T & ReservedFields;

const RESERVED_FIELDS = [LINK_CREATE_FORM_POST_CREATE_FIELD] as const;

type DisallowReservedFields<T> = T & {
  [Field in (typeof RESERVED_FIELDS)[number]]?: never;
};

type OmitReservedFields<T> = Omit<T, keyof ReservedFields>;

export interface CreateFormProps<FormData> {
  children: ReactNode;
  testId?: string;
  onSubmit: (data: OmitReservedFields<FormData>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  /**
   * Hides the rendering of the footer buttons
   */
  hideFooter?: boolean;
  /**
   * Values to initialise the forms initial state with
   * Should not include values for reserved fields
   */
  initialValues?: DisallowReservedFields<FormData>;
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
  const { getValidators, formErrorMessage, enableEditView } = useFormContext();
  const { setShouldShowWarning } = useExitWarningModal();

  const handleSubmit = useCallback(
    async (data: WithReservedFields<FormData>) => {
      createAnalyticsEvent(
        createEventPayload('ui.button.clicked.create', {}),
      ).fire(ANALYTICS_CHANNEL);

      const validators: ValidatorMap = getValidators();
      const errors = validateFormData({ data, validators });

      if (Object.keys(errors).length !== 0) {
        return errors;
      }

      if (getBooleanFF('platform.linking-platform.link-create.enable-edit')) {
        const {
          [LINK_CREATE_FORM_POST_CREATE_FIELD]: shouldEnableEditView,
          ...formData
        } = data;

        /**
         * If form has post-create field set to trigger post-create edit
         * send this to the form context so we know what to do next
         * if submission is successful
         */
        enableEditView?.(!!shouldEnableEditView);

        return onSubmit(formData);
      }

      return onSubmit(data);
    },
    [createAnalyticsEvent, getValidators, onSubmit, enableEditView],
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
    <Form<WithReservedFields<FormData>>
      onSubmit={handleSubmit}
      initialValues={initialValues}
      mutators={{
        setField: <K extends keyof FormData>(
          args: [K, FormData[K]],
          state: MutableState<FormData>,
          tools: Tools<FormData>,
        ) => {
          tools.changeValue(state, args[0].toString(), () => args[1]);
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
            <FormSpy
              subscription={{ modified: true }}
              onChange={state => {
                // determine if any of the fields have been modified
                if (!state.modified) {
                  setShouldShowWarning(false);
                  return;
                }
                const isModified = Object.values(state.modified).some(
                  value => value,
                );
                setShouldShowWarning(isModified);
              }}
            />
            <Box>{children}</Box>
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
