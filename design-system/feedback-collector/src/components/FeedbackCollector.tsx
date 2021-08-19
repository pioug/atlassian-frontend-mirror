import React, { Component } from 'react';

import truncate from 'lodash/truncate';

import { FormFields, SelectOptionDetails, SelectValue } from '../types';

import FeedbackForm from './FeedbackForm';

type FieldValueType = string | Object | Object[];

export type FieldType = {
  id: string;
  value: FieldValueType;
};

type FeedbackType = {
  fields: FieldType[];
};

export interface Props {
  /** The customer email */
  email?: string;
  /** The customer name */
  name?: string;
  /** The request id to access the widget service */
  requestTypeId: string;
  /** The embeddable key to access the widget service */
  embeddableKey: string;
  /**  Additional fields to send to the widget service **/
  additionalFields: FieldType[];
  /**  Override the default id for the "can be contacted" custom field in your widget service **/
  canBeContactedFieldId: string;
  /**  Override the default value for the "can be contacted" custom field in your widget service **/
  canBeContactedDefaultValue: FieldValueType;
  /**  Override the default id for the "customer name" custom field in your widget service **/
  customerNameFieldId: string;
  /**  Override the default value for the "customer name" custom field in your widget service **/
  customerNameDefaultValue: FieldValueType;
  /**  Override the default id for the "description" custom field in your widget service **/
  descriptionFieldId: string;
  /**  Override the default value for the "description" custom field in your widget service **/
  descriptionDefaultValue: FieldValueType;
  /**  Override the default id for the "enroll in research" custom field in your widget service **/
  enrollInResearchFieldId: string;
  /**  Override the default value for the "enroll in research" custom field in your widget service **/
  enrollInResearchDefaultValue: FieldValueType;
  /**  Override the default id for the "email" custom field in your widget service **/
  emailFieldId: string;
  /**  Override the default value for the "email" custom field in your widget service **/
  emailDefaultValue: FieldValueType;
  /**  Override the default id for the "summary" custom field in your widget service **/
  summaryFieldId: string;
  /**  Override the default value for the "summary" custom field in your widget service **/
  summaryDefaultValue: FieldValueType;
  /**  Number of characters that the "summary" field accepts, the rest will be truncated **/
  summaryTruncateLength: number;
  /** After this delay the onSubmit callback will be triggered optimistically **/
  timeoutOnSubmit: number;
  /**  Override the default id for the "type" custom field in your widget service **/
  typeFieldId: string;
  /**  Override the default value for the "Bug" type of response in your widget service **/
  typeBugDefaultValue: FieldValueType;
  /**  Override the default value for the "Comment" type of response in your widget service **/
  typeCommentDefaultValue: FieldValueType;
  /**  Override the default value for the "Suggestion" type of response in your widget service **/
  typeSuggestionDefaultValue: FieldValueType;
  /**  Override the default value for the "Question" type of response in your widget service **/
  typeQuestionDefaultValue: FieldValueType;
  /**  Override the default value for the "Empty" type of response in your widget service **/
  typeEmptyDefaultValue: FieldValueType;
  /**  Override to hide the feedback type select drop down for the feedback **/
  showTypeField: boolean;
  /**  Message which will be shown as the title of the feedback dialog **/
  feedbackTitle?: React.ReactText;
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
  /** Function that will be called optimistically after a delay when the feedback is submitted. */
  onSubmit: (formFields: FormFields) => void;
}

const MAX_SUMMARY_LENGTH_CHARS = 100;

const singleLineTruncatedText = (
  text: string,
  length: number = MAX_SUMMARY_LENGTH_CHARS,
) => {
  const singleLineText = text.replace(/\n/g, ' ');
  return truncate(singleLineText, { length });
};

export default class FeedbackCollector extends Component<Props> {
  static defaultProps = {
    canBeContactedFieldId: 'customfield_10043',
    canBeContactedDefaultValue: [{ id: '10109' }],
    additionalFields: [],
    customerNameFieldId: 'customfield_10045',
    customerNameDefaultValue: 'unknown',
    descriptionFieldId: 'description',
    descriptionDefaultValue: '',
    enrollInResearchFieldId: 'customfield_10044',
    enrollInResearchDefaultValue: [{ id: '10110' }],
    emailFieldId: 'email',
    emailDefaultValue: 'do-not-reply@atlassian.com',
    summaryFieldId: 'summary',
    summaryDefaultValue: '',
    summaryTruncateLength: 100,
    timeoutOnSubmit: 700,
    typeFieldId: 'customfield_10042',
    typeBugDefaultValue: { id: '10105' },
    typeCommentDefaultValue: { id: '10106' },
    typeSuggestionDefaultValue: { id: '10107' },
    typeQuestionDefaultValue: { id: '10108' },
    typeEmptyDefaultValue: { id: 'empty' },
    showTypeField: true,
    onClose: () => {},
    onSubmit: () => {},
  };

  getTypeFieldValue(dtype: SelectValue) {
    switch (dtype) {
      case 'bug':
        return this.props.typeBugDefaultValue;
      case 'comment':
        return this.props.typeCommentDefaultValue;
      case 'suggestion':
        return this.props.typeSuggestionDefaultValue;
      case 'question':
        return this.props.typeQuestionDefaultValue;
      case 'empty':
      default:
        return this.props.typeEmptyDefaultValue;
    }
  }

  getEmail(formValues: FormFields) {
    return formValues.canBeContacted && this.props.email
      ? this.props.email
      : this.props.emailDefaultValue;
  }

  getDescription(formValues: FormFields) {
    return formValues.description || this.props.descriptionDefaultValue;
  }

  getSummary(formValues: FormFields) {
    return (
      singleLineTruncatedText(
        formValues.description,
        this.props.summaryTruncateLength,
      ) || this.props.summaryDefaultValue
    );
  }

  getCustomerName() {
    return this.props.name || this.props.customerNameDefaultValue;
  }

  mapFormToJSD(formValues: FormFields) {
    return {
      fields: [
        this.props.showTypeField
          ? {
              id: this.props.typeFieldId,
              value: this.getTypeFieldValue(formValues.type),
            }
          : undefined,
        {
          id: this.props.summaryFieldId,
          value: this.getSummary(formValues),
        },
        {
          id: this.props.descriptionFieldId,
          value: this.getDescription(formValues),
        },
        {
          id: this.props.emailFieldId,
          value: this.getEmail(formValues),
        },
        {
          id: this.props.customerNameFieldId,
          value: this.getCustomerName(),
        },
        formValues.canBeContacted
          ? {
              id: this.props.canBeContactedFieldId,
              value: this.props.canBeContactedDefaultValue,
            }
          : undefined,
        formValues.enrollInResearchGroup
          ? {
              id: this.props.enrollInResearchFieldId,
              value: this.props.enrollInResearchDefaultValue,
            }
          : undefined,
        ...this.props.additionalFields,
      ].filter(Boolean),
    } as FeedbackType;
  }

  postFeedback = (formValues: FormFields) => {
    const body: FeedbackType = this.mapFormToJSD(formValues);

    // Don't dispatch unless we have suitable props (allows tests to pass through empty strings and avoid redundant network calls)
    if (this.props.embeddableKey && this.props.requestTypeId) {
      fetch(
        `https://jsd-widget.atlassian.com/api/embeddable/${this.props.embeddableKey}/request?requestTypeId=${this.props.requestTypeId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
    }

    this.props.onClose();

    // slightly delay confirming submit since we don't wait for the REST call to succeed
    //
    // Because `onClose` is invoked prior to this timeout triggering, the `componentWillUnmount`
    // may occur before the `onSubmit` is called. To prevent prematurely cancelling the
    // network request, we deliberately don't clear this timeout inside `componentWillUnmount`.
    //
    setTimeout(
      () => this.props.onSubmit(formValues),
      this.props.timeoutOnSubmit,
    );
  };

  render() {
    return (
      <FeedbackForm
        feedbackTitle={this.props.feedbackTitle}
        feedbackTitleDetails={this.props.feedbackTitleDetails}
        showTypeField={this.props.showTypeField}
        canBeContactedLabel={this.props.canBeContactedLabel}
        enrolInResearchLabel={this.props.enrolInResearchLabel}
        summaryPlaceholder={this.props.summaryPlaceholder}
        submitButtonLabel={this.props.submitButtonLabel}
        cancelButtonLabel={this.props.cancelButtonLabel}
        feedbackGroupLabels={this.props.feedbackGroupLabels}
        onSubmit={this.postFeedback}
        onClose={this.props.onClose}
      />
    );
  }
}
