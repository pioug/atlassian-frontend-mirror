/** @jsx jsx */
import { type ReactNode, useCallback } from 'react';

import { css, jsx } from '@emotion/react';
import { FORM_ERROR, type MutableState, type Tools } from 'final-form';
import { Form, FormSpy } from 'react-final-form';
import { useIntl } from 'react-intl-next';

import { RequiredAsterisk } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import {
  CREATE_FORM_MAX_WIDTH_IN_PX,
  LINK_CREATE_FORM_POST_CREATE_FIELD,
} from '../../common/constants';
import messages from '../../common/messages';
import { useLinkCreateCallback } from '../../controllers/callback-context';
import { useExitWarningModal } from '../../controllers/exit-warning-modal-context';
import { useFormContext } from '../../controllers/form-context';

import { CreateFormFooter } from './form-footer';
import { CreateFormLoader } from './form-loader';

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

type Errors = Record<string, string>;

export interface CreateFormProps<FormData> {
  /**
   * Should resolve to void, or resolve to an object of
   * keys (field names) with error messages (key values)
   */
  onSubmit: (
    data: OmitReservedFields<FormData>,
  ) => void | Errors | Promise<void | Errors>;
  /**
   * Children to render in the form (form fields)
   */
  children: ReactNode;
  /**
   * Test id to render on the form element
   */
  testId?: string;
  /**
   * Callback when the cancel button is fired
   */
  onCancel?: () => void;
  /**
   * Renders a spinner when true
   */
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
  const { setFormErrorMessage, formErrorMessage, enableEditView } =
    useFormContext();
  const intl = useIntl();
  const { setShouldShowWarning } = useExitWarningModal();
  const { onFailure } = useLinkCreateCallback();

  const handleSubmit = useCallback(
    async (data: WithReservedFields<FormData>) => {
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

      /**
       * This is the onSubmit handler provided by the plugin
       * It will be async, and it will likely involve awaiting `onCreate` (the adopters handler)
       */
      return onSubmit(formData);
    },
    [onSubmit, enableEditView],
  );

  const handleSubmitWithErrorHandling: typeof handleSubmit = useCallback(
    async (...args) => {
      try {
        /**
         * Clear any error message that may have been set by async select fields
         * This will immediately remove any indication of an error, but the form likely will fail to submit,
         * it will be likely a 400 because the user probably could not set all fields anyway
         */
        setFormErrorMessage();
        return await handleSubmit(...args);
      } catch (error) {
        /**
         * Notify link create of failed experience
         */
        onFailure?.(error);

        /**
         * Return a generic message for react final form to render
         */
        return {
          [FORM_ERROR]: intl.formatMessage(messages.genericErrorMessage),
        };
      }
    },
    [handleSubmit, setFormErrorMessage, intl, onFailure],
  );

  const handleCancel = useCallback(() => {
    onCancel && onCancel();
  }, [onCancel]);

  if (isLoading) {
    return <CreateFormLoader />;
  }

  return (
    <Form<WithReservedFields<FormData>>
      onSubmit={handleSubmitWithErrorHandling}
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
      {({ submitError, ...formProps }) => {
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
            <p aria-hidden="true">
              {intl.formatMessage(messages.requiredFieldInstruction)}{' '}
              <RequiredAsterisk />
            </p>
            <Box>{children}</Box>
            {!hideFooter && (
              <CreateFormFooter
                /**
                 * We will prefer to render the error message connected to
                 * react final form state (submitError) otherwise we can
                 * default to the `formErrorMessage` that we sometimes use with our own
                 * "form context" (only currently used for AsyncSelect field reporting failed loading)
                 */
                formErrorMessage={submitError || formErrorMessage}
                handleCancel={handleCancel}
                testId={testId}
              />
            )}
          </form>
        );
      }}
    </Form>
  );
};
