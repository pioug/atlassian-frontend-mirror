import React, { Component } from 'react';

import { FormFields, SelectOptionDetails, SelectValue } from '../types';
import truncate from '../utils/Truncate';

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
  /** Override the URL for HTTPS calls, only needed if service is not behind stargate (like the Atlaskit frontend itself) */
  url: string;
  /** The customer email */
  email?: string;
  /** The customer name */
  name?: string;
  /** The request id to access the widget service */
  requestTypeId: string;
  /** The embeddable key to access the widget service. Accessible from the corresponding Jira project */
  embeddableKey: string;
  /**  Additional fields to send to the widget service **/
  additionalFields: FieldType[];
  /**  Override the default id for the "can be contacted" custom field in your widget service **/
  canBeContactedFieldId: string;
  /**  Override the default value for the "can be contacted" custom field in your widget service */
  canBeContactedDefaultValue: FieldValueType;
  /**  Override the default id for the "customer name" custom field in your widget service */
  customerNameFieldId: string;
  /**  Override the default value for the "customer name" custom field in your widget service */
  customerNameDefaultValue: FieldValueType;
  /**  Override the default id for the "description" custom field in your widget service */
  descriptionFieldId: string;
  /**  Override the default value for the "description" custom field in your widget service */
  descriptionDefaultValue: FieldValueType;
  /**  Override the default id for the "enroll in research" custom field in your widget service */
  enrollInResearchFieldId: string;
  /**  Override the default value for the "enroll in research" custom field in your widget service */
  enrollInResearchDefaultValue: FieldValueType;
  /**  Override the default id for the "email" custom field in your widget service */
  emailFieldId: string;
  /**  Override the default value for the "email" custom field in your widget service */
  emailDefaultValue: FieldValueType;
  /**  Override the default id for the "summary" custom field in your widget service */
  summaryFieldId: string;
  /**  Override the default value for the "summary" custom field in your widget service */
  summaryDefaultValue: FieldValueType;
  /**  Number of characters that the "summary" field accepts, the rest will be truncated */
  summaryTruncateLength: number;
  /** After this delay the onSubmit callback will be triggered optimistically */
  timeoutOnSubmit: number;
  /**  Override the default id for the "type" custom field in your widget service */
  typeFieldId: string;
  /**  Override the default value for the "Bug" type of response in your widget service */
  typeBugDefaultValue: FieldValueType;
  /**  Override the default value for the "Comment" type of response in your widget service */
  typeCommentDefaultValue: FieldValueType;
  /**  Override the default value for the "Suggestion" type of response in your widget service */
  typeSuggestionDefaultValue: FieldValueType;
  /**  Override the default value for the "Question" type of response in your widget service */
  typeQuestionDefaultValue: FieldValueType;
  /**  Override the default value for the "Empty" type of response in your widget service */
  typeEmptyDefaultValue: FieldValueType;
  /**  Override to hide the feedback type select drop down for the feedback */
  showTypeField: boolean;
  /**  Message which will be shown as the title of the feedback dialog */
  feedbackTitle?: React.ReactText;
  /**  Message which will be shown below the title of the feedback dialog */
  feedbackTitleDetails?: React.ReactChild;
  /**  Message which will be shown next to the enrol in research checkbox */
  enrolInResearchLabel?: React.ReactChild;
  /**  Message which will be shown next to the can be contacted checkbox */
  canBeContactedLabel?: React.ReactChild;
  /**  Message which will be shown inside the summary text field */
  summaryPlaceholder?: string;
  /**  Message for submit button label */
  submitButtonLabel?: string;
  /**  Message for cancel button label */
  cancelButtonLabel?: string;
  /**  Message for select option labels and field labels */
  feedbackGroupLabels?: Record<SelectValue, SelectOptionDetails>;
  /** Function that will be called to initiate the exit transition. */
  onClose: () => void;
  /** Function that will be called optimistically after a delay when the feedback is submitted. */
  onSubmit: (formFields: FormFields) => void;
  /**  Optional locale for i18n */
  locale?: string;
}

const MAX_SUMMARY_LENGTH_CHARS = 100;

const singleLineTruncatedText = (
  text: string,
  length: number = MAX_SUMMARY_LENGTH_CHARS,
) => {
  const singleLineText = text.replace(/\n/g, ' ');
  return truncate(singleLineText, length);
};

export default class FeedbackCollector extends Component<Props> {
  static defaultProps = {
    url: '/gateway/api',
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

  async getEntitlementInformation(): Promise<FieldType[] | []> {
    const url = this.props.url;
    // jira / confluence / bitbucket
    let productName;
    let productEntitlement;
    let entitlementDetails;
    let productKey: string;
    if (window.location.host.includes('bitbucket.org')) {
      productName = 'Bitbucket';
      productKey = 'bitbucket';
      entitlementDetails = JSON.parse(
        JSON.stringify(
          document
            .querySelector('meta[name="bb-bootstrap"]')
            ?.getAttribute('data-current-user'),
        ),
      );
      const hasPremium = entitlementDetails['hasPremium'];
      productEntitlement = hasPremium ? 'PREMIUM' : 'STANDARD';
    } else {
      if (document.querySelector('meta[id="confluence-context-path"]')) {
        productName = 'Confluence';
        productKey = 'pricingplan.confluence.ondemand';
      } else {
        productName = 'Jira';
        productKey = 'jira-software.ondemand';
      }

      try {
        entitlementDetails = await fetch(
          `${url}/customer-context/entitlements/${window.location.host}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            ...(this.props.url === `/gateway/api`
              ? { credentials: 'include' }
              : {}),
          },
        );
      } catch (e) {
        entitlementDetails = undefined;
      }
    }

    let entitlement;
    const entitlementInformation = [];
    const cloudSiteId =
      (entitlementDetails && entitlementDetails.cloudSiteId) || '';
    if (entitlementDetails && entitlementDetails.children) {
      entitlement = entitlementDetails.children.find(
        (entitlement: { key: string }) => {
          return entitlement.key === productKey;
        },
      );
    }

    entitlementInformation.push(
      {
        id: 'product',
        value: productName ? productName?.toLowerCase() : '',
      },
      {
        id: 'hostingType',
        value:
          entitlement && entitlement.product
            ? entitlement.product.hostingType
            : 'CLOUD',
      },
      {
        id: 'entitlementEdition',
        value: productEntitlement || '',
      },
      {
        id: 'cloudId',
        value: cloudSiteId,
      },
    );

    return entitlementInformation;
  }

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

  async getEmailAndAtlassianID(formValues: FormFields) {
    try {
      if (formValues.canBeContacted) {
        if (this.props.email) {
          return {
            email: this.props.email,
            aaidOrHash: Buffer.from(this.props.email as string).toString(
              'base64',
            ),
          };
        }
        const url = this.props.url;
        const result = await fetch(`${url}/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const json = await result.json();
        return { email: json.email, aaidOrHash: json.account_id };
      } else {
        return {
          email: this.props.emailDefaultValue,
          aaidOrHash: Buffer.from(
            this.props.emailDefaultValue as string,
          ).toString('base64'),
        };
      }
    } catch (e) {
      return {
        email: this.props.emailDefaultValue,
        aaidOrHash: Buffer.from(
          this.props.emailDefaultValue as string,
        ).toString('base64'),
      };
    }
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

  async mapFormToJSD(formValues: FormFields) {
    const entitlementInformation = await this.getEntitlementInformation();

    return {
      fields: [
        ...((entitlementInformation !== null && entitlementInformation) || []),
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
          value: (await this.getEmailAndAtlassianID(formValues)).email,
        },
        {
          id: 'aaidOrHash',
          value: (await this.getEmailAndAtlassianID(formValues)).aaidOrHash,
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

  postFeedback = async (formValues: FormFields) => {
    const requestType: string = this.props.requestTypeId;
    const embedKey: string = this.props.embeddableKey;
    let url: string = this.props.url;

    // Don't dispatch unless we have suitable props (allows tests to pass through empty strings and avoid redundant network calls)
    if (embedKey && requestType) {
      const formData: FeedbackType = await this.mapFormToJSD(formValues);
      const body = {
        feedback: {
          requestType: this.props.requestTypeId,
          embedKey: this.props.embeddableKey,
          ...formData,
        },
      };

      if (this.props.url === `/gateway/api`) {
        url += '/feedback-collector-api';
      } else {
        url = 'https://feedback-collector-api.services.atlassian.com';
      }
      const postData = Buffer.from(JSON.stringify(body)).toString('base64');
      fetch(`${url}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: postData }),
        ...(this.props.url === `/gateway/api`
          ? { credentials: 'include' }
          : {}),
      });
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
        locale={this.props.locale}
      />
    );
  }
}
