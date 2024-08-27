import { Buffer } from 'buffer';

import React, { Component } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { type FormFields, type SelectOptionDetails, type SelectValue } from '../types';
import { isApiGatewayUrl } from '../utils/is-api-gateway-url';
import truncate from '../utils/Truncate';

import FeedbackForm, { type OptionType } from './FeedbackForm';

type FieldValueType = string | Object | Object[];

export type FieldType = {
	id: string;
	value: FieldValueType;
};

type FeedbackType = {
	fields: FieldType[];
};

export interface Props {
	/** Override the URL for all HTTPS calls, only needed if service is not behind stargate (like the Atlaskit frontend itself) */
	url?: string;
	/** A custom URL for the Stargate gateway, this field takes priority over `url` */
	customGatewayUrl?: string;
	/** A custom URL for the Feedback Collector API, this field takes priority over `url` */
	customFeedbackUrl?: string;
	/** Whether to request email details and product entitlements */
	shouldGetEntitlementDetails?: boolean;
	/** The customer name */
	name?: string;
	/** The id of the entrypoint in the feedback service; to acquire your entrypointId, visit the #feedback-collectors channel */
	entrypointId: string;
	/**  Additional fields to send to the widget service **/
	additionalFields: FieldType[];
	/**  Override the default id for the "can be contacted" custom field in your widget service **/
	canBeContactedFieldId: string;
	/**  Override the agree value for the "can be contacted" custom field in your widget service */
	canBeContactedAgreeValue: FieldValueType;
	/**  Override the decline value for the "can be contacted" custom field in your widget service */
	canBeContactedDeclineValue: FieldValueType;
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
	/**  Override the agree value for the "enroll in research" custom field in your widget service */
	enrollInResearchAgreeValue: FieldValueType;
	/**  Override the decline value for the "enroll in research" custom field in your widget service */
	enrollInResearchDeclineValue: FieldValueType;
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
	/** Optional custom modal content */
	customContent?: React.ReactChild;
	/**  Override to hide the default text fields for feedback */
	showDefaultTextFields?: boolean;
	/** Optional parameter for feedback submitter's Atlassian Account ID */
	atlassianAccountId?: string;
	/** Optional parameter for feedback submitter's email address */
	email?: string;
	/** Override to mark feedback as anonymous */
	anonymousFeedback?: boolean;
	/** Optional custom label for select field */
	selectLabel?: string;
	/** Optional custom label for TextArea when showTypeField is false*/
	customTextAreaLabel?: string;
	/** Custom Select feedback options */
	customFeedbackOptions?: OptionType[];
	/** Optional ref to return focus to after feedback form is closed */
	shouldReturnFocusRef?: React.MutableRefObject<HTMLElement>;
}

const MAX_SUMMARY_LENGTH_CHARS = 100;

const singleLineTruncatedText = (text: string, length: number = MAX_SUMMARY_LENGTH_CHARS) => {
	const singleLineText = text.replace(/\n/g, ' ');
	return truncate(singleLineText, length);
};

export default class FeedbackCollector extends Component<Props> {
	state = {
		anonymousFeedback: true,
	};

	async componentDidMount() {
		const anonymousFeedback = !(await this.shouldShowOptInCheckboxesNew());
		this.setState({ anonymousFeedback });
	}

	static defaultProps = {
		url: '/gateway/api',
		shouldGetEntitlementDetails: true,
		canBeContactedFieldId: 'customfield_10043',
		canBeContactedAgreeValue: [{ id: '10109' }],
		canBeContactedDeclineValue: [{ id: '10111' }],
		additionalFields: [],
		customerNameFieldId: 'customfield_10045',
		customerNameDefaultValue: 'unknown',
		descriptionFieldId: 'description',
		descriptionDefaultValue: '',
		enrollInResearchFieldId: 'customfield_10044',
		enrollInResearchAgreeValue: [{ id: '10110' }],
		enrollInResearchDeclineValue: [{ id: '10112' }],
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
		showDefaultTextFields: true,
		anonymousFeedback: false,
		onClose: () => {},
		onSubmit: () => {},
	};

	getGatewayUrl(): string {
		const { customGatewayUrl, url } = this.props;

		if (customGatewayUrl) {
			return customGatewayUrl;
		}
		if (url) {
			return url;
		}
		return FeedbackCollector.defaultProps.url;
	}

	getFeedbackUrl() {
		const { customFeedbackUrl, url } = this.props;

		if (customFeedbackUrl) {
			return customFeedbackUrl;
		}
		if (url) {
			return url;
		}
		return FeedbackCollector.defaultProps.url;
	}

	getPackageVersion(): string {
		return process.env._PACKAGE_VERSION_ || 'Unknown, at least 11.0.0';
	}

	async getEntitlementInformation(): Promise<FieldType[] | []> {
		const url = this.getGatewayUrl();
		// jira / confluence / bitbucket / trello
		let productName;
		let productEntitlement;
		let entitlementDetails;
		let productKey: string;
		if (window.location.host.includes('bitbucket.org')) {
			productName = 'Bitbucket';
			productKey = 'bitbucket';
			entitlementDetails = JSON.parse(
				JSON.stringify(
					document.querySelector('meta[id="bb-bootstrap"]')?.getAttribute('data-current-user'),
				),
			);
			const hasPremium = entitlementDetails['hasPremium'];
			productEntitlement = hasPremium ? 'PREMIUM' : 'STANDARD';
		} else if (['trellis.coffee', 'trello.com'].includes(window.location.host)) {
			productName = 'Trello';
			productKey = 'trello';
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
						...(isApiGatewayUrl(url) ? { credentials: 'include' } : {}),
					},
				);
			} catch (e) {
				entitlementDetails = undefined;
			}
		}

		let entitlement;
		const entitlementInformation: Array<{ id: string; value: any }> = [];
		const cloudSiteId = entitlementDetails?.cloudSiteId || '';
		if (entitlementDetails?.children) {
			entitlement = entitlementDetails?.children.find((entitlement: { key: string }) => {
				return entitlement.key === productKey;
			});
		}

		entitlementInformation.push(
			{
				id: 'product',
				value: productName ? productName?.toLowerCase() : '',
			},
			{
				id: 'hostingType',
				value: entitlement?.product ? entitlement.product.hostingType : 'CLOUD',
			},
			{
				id: 'entitlementEdition',
				value: productEntitlement ?? '',
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

	async getAtlassianID(): Promise<string | undefined> {
		const { atlassianAccountId, shouldGetEntitlementDetails } = this.props;
		try {
			if (atlassianAccountId || !shouldGetEntitlementDetails) {
				return atlassianAccountId;
			}
			const url = this.getGatewayUrl();
			const result = await fetch(`${url}/me`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				...(isApiGatewayUrl(url) ? { credentials: 'include' } : {}),
			});
			const json = await result.json();

			return json.account_id;
		} catch (e) {
			return undefined;
		}
	}

	shouldShowOptInCheckboxes(): boolean {
		if (this.props.anonymousFeedback) {
			return !this.props.anonymousFeedback;
		}
		if (this.props.atlassianAccountId) {
			return true;
		}
		let response: boolean;
		this.getAtlassianID()
			.then((result) => {
				response = result !== undefined;
			})
			.catch(() => {
				response = false;
			});
		// @ts-ignore
		return response;
	}

	shouldShowOptInCheckboxesNew(): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			if (this.props.anonymousFeedback) {
				resolve(!this.props.anonymousFeedback);
			}
			if (this.props.atlassianAccountId) {
				resolve(true);
			}
			this.getAtlassianID()
				.then((result) => {
					resolve(result !== undefined);
				})
				.catch(() => {
					resolve(false);
				});
		});
	}

	getDescription(formValues: FormFields) {
		return formValues.description || this.props.descriptionDefaultValue;
	}

	getSummary(formValues: FormFields) {
		return (
			singleLineTruncatedText(formValues.description, this.props.summaryTruncateLength) ||
			this.props.summaryDefaultValue
		);
	}

	getCustomerName() {
		return this.props.name ?? this.props.customerNameDefaultValue;
	}

	addEmailToContext() {
		const contextField = this.props.additionalFields.find((field) => {
			return field.id === 'customfield_10047';
		});
		if (contextField) {
			contextField.value = `${contextField.value}
        email: ${this.props.email}`;
		} else {
			this.props.additionalFields.push({
				id: 'customfield_10047',
				value: `email: ${this.props.email}`,
			});
		}
	}

	async mapFormToJSD(formValues: FormFields) {
		let entitlementInformation: FieldType[] | [] | null = null;

		if (this.props.shouldGetEntitlementDetails) {
			entitlementInformation = await this.getEntitlementInformation();
		}
		if (this.props.email) {
			this.addEmailToContext();
		}

		const atlassianID = await this.getAtlassianID();

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
					id: 'aaidOrHash',
					value: formValues.canBeContacted ? atlassianID : undefined,
				},
				{
					id: this.props.customerNameFieldId,
					value: this.getCustomerName(),
				},
				formValues.canBeContacted
					? {
							id: this.props.canBeContactedFieldId,
							value: this.props.canBeContactedAgreeValue,
						}
					: {
							id: this.props.canBeContactedFieldId,
							value: this.props.canBeContactedDeclineValue,
						},
				formValues.enrollInResearchGroup
					? {
							id: this.props.enrollInResearchFieldId,
							value: this.props.enrollInResearchAgreeValue,
						}
					: {
							id: this.props.enrollInResearchFieldId,
							value: this.props.enrollInResearchDeclineValue,
						},
				...this.props.additionalFields,
			].filter(Boolean),
		} as FeedbackType;
	}

	postFeedback = async (formValues: FormFields) => {
		const entrypointId: string = this.props.entrypointId;
		let fetchUrl: string = this.getFeedbackUrl();

		// Don't dispatch unless we have suitable props (allows tests to pass through empty strings and avoid redundant network calls)
		if (entrypointId) {
			const formData: FeedbackType = await this.mapFormToJSD(formValues);
			const body = {
				feedback: {
					entrypointId: this.props.entrypointId,
					entrypointUiVersion: this.getPackageVersion(),
					...formData,
				},
			};

			if (isApiGatewayUrl(fetchUrl)) {
				fetchUrl += '/feedback-collector-api';
			} else if (!this.props.customFeedbackUrl) {
				fetchUrl = 'https://feedback-collector-api.services.atlassian.com';
			}

			const postData = Buffer.from(JSON.stringify(body)).toString('base64');
			fetch(`${fetchUrl}/v2/feedback`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ data: postData }),
				credentials: 'include',
			});
		}

		this.props.onClose();

		// slightly delay confirming submit since we don't wait for the REST call to succeed
		//
		// Because `onClose` is invoked prior to this timeout triggering, the `componentWillUnmount`
		// may occur before the `onSubmit` is called. To prevent prematurely cancelling the
		// network request, we deliberately don't clear this timeout inside `componentWillUnmount`.
		//
		setTimeout(() => this.props.onSubmit(formValues), this.props.timeoutOnSubmit);
	};

	render() {
		const anonymousFeedback: boolean = !this.shouldShowOptInCheckboxes();
		return (
			<FeedbackForm
				customContent={this.props.customContent}
				feedbackTitle={this.props.feedbackTitle}
				feedbackTitleDetails={this.props.feedbackTitleDetails}
				showTypeField={this.props.showTypeField}
				showDefaultTextFields={this.props.showDefaultTextFields}
				hasDescriptionDefaultValue={!!this.props.descriptionDefaultValue}
				canBeContactedLabel={this.props.canBeContactedLabel}
				enrolInResearchLabel={this.props.enrolInResearchLabel}
				summaryPlaceholder={this.props.summaryPlaceholder}
				submitButtonLabel={this.props.submitButtonLabel}
				cancelButtonLabel={this.props.cancelButtonLabel}
				feedbackGroupLabels={this.props.feedbackGroupLabels}
				onSubmit={this.postFeedback}
				onClose={this.props.onClose}
				locale={this.props.locale}
				anonymousFeedback={
					fg('platform.proforma-form-builder-feedback_hupaz')
						? this.state.anonymousFeedback
						: anonymousFeedback
				}
				selectLabel={this.props.selectLabel}
				customTextAreaLabel={this.props.customTextAreaLabel}
				customFeedbackOptions={this.props.customFeedbackOptions}
				shouldReturnFocusRef={this.props.shouldReturnFocusRef}
			/>
		);
	}
}
