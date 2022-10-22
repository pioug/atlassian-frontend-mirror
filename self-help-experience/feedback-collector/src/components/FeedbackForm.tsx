import React, { FunctionComponent, useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { Field } from '@atlaskit/form';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@atlaskit/modal-dialog';
import Select from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';

import { messages } from '../messages';
import { FormFields, SelectOptionDetails, SelectValue } from '../types';

import { IntlProviderWithResolvedMessages } from './IntlProviderWithResolvedMessages';

interface Props {
  /**  Message which will be shown as the title of the feedback dialog **/
  feedbackTitle?: React.ReactText;
  /**  Override to hide the feedback type select drop down for the feedback **/
  showTypeField?: boolean;
  /**  Message which will be shown below the title of the feedback dialog **/
  feedbackTitleDetails?: React.ReactChild;
  /**  Message which will be shown next to the enrol in research checkbox **/
  enrolInResearchLabel?: React.ReactChild;
  /**  Message which will be shown next to the can be contacted checkbox **/
  canBeContactedLabel?: React.ReactChild;
  /**  Message which will be shown inside the summary text field **/
  summaryPlaceholder?: string;
  /**  Message for submit button label **/
  submitButtonLabel?: string;
  /**  Message for cancel button label **/
  cancelButtonLabel?: string;
  /**  Message for select option labels and field labels **/
  feedbackGroupLabels?: Record<SelectValue, SelectOptionDetails>;
  /** Function that will be called to initiate the exit transition. */
  onClose: () => void;
  /** Function that will be called immediately after the submit action  */
  onSubmit: (formValues: FormFields) => void;
  /**  Optional locale for i18n **/
  locale?: string;
}

export interface OptionType {
  label: React.ReactText;
  value: SelectValue;
}

const FeedbackForm: React.FunctionComponent<Props> = ({
  showTypeField = true,
  onClose,
  onSubmit,
  feedbackTitle,
  feedbackTitleDetails,
  feedbackGroupLabels,
  summaryPlaceholder,
  canBeContactedLabel,
  enrolInResearchLabel,
  submitButtonLabel,
  cancelButtonLabel,
}) => {
  const [canBeContacted, setCanBeContacted] = useState<
    FormFields['canBeContacted']
  >(false);
  const [description, setDescription] = useState<FormFields['description']>('');
  const [enrollInResearchGroup, setEnrollInResearchGroup] = useState<
    FormFields['enrollInResearchGroup']
  >(false);
  const [type, setType] = useState<FormFields['type']>('empty');
  const { formatMessage } = useIntl();
  const isTypeSelected = () => type !== 'empty';

  const canShowTextField = isTypeSelected() || !showTypeField;

  const isDisabled = showTypeField
    ? !isTypeSelected() || !description
    : !description;

  const getFieldLabels = (
    record?: Record<SelectValue, SelectOptionDetails>,
  ): Record<SelectValue, React.ReactText> => ({
    bug: record?.bug.fieldLabel || formatMessage(messages.formBugLabel),
    comment:
      record?.comment.fieldLabel || formatMessage(messages.formCommentLabel),
    suggestion:
      record?.suggestion.fieldLabel ||
      formatMessage(messages.formSuggestionLabel),
    question:
      record?.question.fieldLabel || formatMessage(messages.formQuestionLabel),
    empty: record?.empty.fieldLabel || formatMessage(messages.formEmptyLabel),
  });

  const getSelectOptions = (
    record?: Record<SelectValue, SelectOptionDetails>,
  ): OptionType[] => [
    {
      label:
        record?.question.selectOptionLabel ||
        formatMessage(messages.selectionOptionQuestionLabel),
      value: 'question',
    },
    {
      label:
        record?.comment.selectOptionLabel ||
        formatMessage(messages.selectionOptionCommentLabel),
      value: 'comment',
    },
    {
      label:
        record?.bug.selectOptionLabel ||
        formatMessage(messages.selectionOptionBugLabel),
      value: 'bug',
    },
    {
      label:
        record?.suggestion.selectOptionLabel ||
        formatMessage(messages.selectionOptionSuggestionLabel),
      value: 'suggestion',
    },
  ];

  const getDefaultSelectValue = (
    record?: Record<SelectValue, SelectOptionDetails>,
  ): OptionType => ({
    label:
      record?.empty.selectOptionLabel ||
      formatMessage(messages.selectionOptionDefaultLabel),
    value: 'empty',
  });

  return (
    <Modal onClose={onClose} testId="feedbackCollectorModalDialog">
      <Form
        onSubmit={() => {
          onSubmit({
            canBeContacted,
            description,
            enrollInResearchGroup,
            type,
          });
        }}
      >
        {({ formProps }) => (
          <form {...formProps}>
            <ModalHeader>
              <ModalTitle>
                {feedbackTitle || (
                  <FormattedMessage {...messages.feedbackTitle} />
                )}
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              {feedbackTitleDetails}
              {showTypeField ? (
                <Select<OptionType>
                  onChange={(option) => {
                    if (!option || option instanceof Array) {
                      return;
                    }
                    setType(option.value);
                  }}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                  defaultValue={getDefaultSelectValue(feedbackGroupLabels)}
                  options={getSelectOptions(feedbackGroupLabels)}
                />
              ) : null}
              {canShowTextField && (
                <>
                  <Field
                    label={
                      showTypeField
                        ? getFieldLabels(feedbackGroupLabels)[type]
                        : null
                    }
                    isRequired
                    name="description"
                  >
                    {({ fieldProps }) => (
                      <TextArea
                        {...fieldProps}
                        name="foo"
                        minimumRows={6}
                        placeholder={
                          summaryPlaceholder ||
                          formatMessage(messages.summaryPlaceholder)
                        }
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                      />
                    )}
                  </Field>
                  <Field name="can-be-contacted">
                    {({ fieldProps }) => (
                      <Checkbox
                        {...fieldProps}
                        label={
                          canBeContactedLabel ||
                          formatMessage(messages.canBeContactedLabel)
                        }
                        onChange={(event) =>
                          setCanBeContacted(event.target.checked)
                        }
                      />
                    )}
                  </Field>

                  <Field name="enroll-in-research-group">
                    {({ fieldProps }) => (
                      <Checkbox
                        {...fieldProps}
                        label={
                          enrolInResearchLabel ||
                          formatMessage(messages.enrolInResearchLabel)
                        }
                        onChange={(event) =>
                          setEnrollInResearchGroup(event.target.checked)
                        }
                      />
                    )}
                  </Field>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle" onClick={onClose}>
                {cancelButtonLabel || (
                  <FormattedMessage {...messages.cancelButtonLabel} />
                )}
              </Button>
              <Button
                appearance="primary"
                type="submit"
                isDisabled={isDisabled}
                testId="feedbackCollectorSubmitBtn"
              >
                {submitButtonLabel || (
                  <FormattedMessage {...messages.submitButtonLabel} />
                )}
              </Button>
            </ModalFooter>
          </form>
        )}
      </Form>
    </Modal>
  );
};

const FeedbackFormWithIntl: FunctionComponent<Props & { locale?: string }> = ({
  locale,
  ...props
}) => {
  return (
    <IntlProviderWithResolvedMessages locale={locale}>
      <FeedbackForm {...props} />
    </IntlProviderWithResolvedMessages>
  );
};

export default FeedbackFormWithIntl;
