import React, { type FunctionComponent, useRef, useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { ErrorMessage, Field, Fieldset, RequiredAsterisk } from '@atlaskit/form';
import Link from '@atlaskit/link';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import SectionMessage from '@atlaskit/section-message';
import Select from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';
import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../messages';
import { type FormFields, type SelectOptionDetails, type SelectValue } from '../types';

import { IntlProviderWithResolvedMessages } from './IntlProviderWithResolvedMessages';

interface Props {
	/**  Message which will be shown as the title of the feedback dialog **/
	feedbackTitle?: React.ReactText;
	/**  Override to hide the feedback type select drop down for the feedback **/
	showTypeField?: boolean;
	/**  Override to hide the default text fields for feedback **/
	showDefaultTextFields?: boolean;
	/** Indicates if the description field has a default value to unlock the form submission */
	hasDescriptionDefaultValue?: boolean;
	/**  Message which will be shown below the title of the feedback dialog **/
	feedbackTitleDetails?: React.ReactChild;
	/**  Message which will be shown next to the enrol in research checkbox **/
	enrolInResearchLabel?: React.ReactChild;
	/**  Message which will be shown below the enrol in research checkbox **/
	enrolInResearchLink?: React.ReactNode;
	/**  Message which will be shown next to the can be contacted checkbox **/
	canBeContactedLabel?: React.ReactChild;
	/**  Link which will be shown below the can be contacted checkbox **/
	canBeContactedLink?: React.ReactNode;
	/**  Message which will be shown inside the summary text field **/
	summaryPlaceholder?: string;
	/**  Message for submit button label **/
	submitButtonLabel?: string;
	/**  Message for cancel button label **/
	cancelButtonLabel?: string;
	/**  Message for select option labels and field labels **/
	feedbackGroupLabels?: Partial<Record<SelectValue, SelectOptionDetails>>;
	/** Function that will be called to initiate the exit transition. */
	onClose: () => void;
	/** Function that will be called immediately after the submit action  */
	onSubmit: (formValues: FormFields) => Promise<void>;
	/**  Optional locale for i18n **/
	locale?: string;
	/** Optional custom content */
	customContent?: React.ReactChild;
	/** Optional parameter for showing contact opt-in checkboxes */
	anonymousFeedback?: boolean;
	/** Optional custom label for select field */
	selectLabel?: string;
	/** Optional custom label for TextArea when showTypeField is false*/
	customTextAreaLabel?: string;
	/** Custom Select feedback options */
	customFeedbackOptions?: OptionType[];
	/** React Ref to focus on close */
	shouldReturnFocusRef?: React.RefObject<HTMLElement>;
	/** Disable submit button to allow custom content to handle validation */
	disableSubmitButton?: boolean;
	/** Optional to show or hide the required fields summary */
	showRequiredFieldsSummary?: boolean;
}

export interface OptionType {
	label: React.ReactText;
	value: SelectValue;
}

const LinkWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<span
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				paddingInlineStart: token('space.300'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginInlineStart: token('space.050'),
			}}
		>
			{children}
		</span>
	);
};

const FeedbackForm: React.FunctionComponent<Props> = ({
	showTypeField = true,
	showDefaultTextFields = true,
	customContent,
	onClose,
	onSubmit,
	feedbackTitle,
	feedbackTitleDetails,
	feedbackGroupLabels,
	summaryPlaceholder,
	canBeContactedLabel,
	canBeContactedLink,
	enrolInResearchLabel,
	enrolInResearchLink,
	submitButtonLabel,
	cancelButtonLabel,
	anonymousFeedback,
	hasDescriptionDefaultValue,
	selectLabel,
	customTextAreaLabel,
	customFeedbackOptions = [],
	shouldReturnFocusRef,
	disableSubmitButton,
	showRequiredFieldsSummary = true,
}) => {
	const [canBeContacted, setCanBeContacted] = useState<FormFields['canBeContacted']>(false);
	const [description, setDescription] = useState<FormFields['description']>('');
	const [enrollInResearchGroup, setEnrollInResearchGroup] =
		useState<FormFields['enrollInResearchGroup']>(false);
	const [type, setType] = useState<FormFields['type']>('empty');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [validationErrors, setValidationErrors] = useState<{
		type?: string;
		description?: string;
	}>({});
	const { formatMessage } = useIntl();
	const isTypeSelected = () => type !== 'empty';

	const canShowTextField = isTypeSelected() || !showTypeField;

	const hasDescription = description || hasDescriptionDefaultValue;

	// Feature flag determines validation behavior
	const useNewValidation = fg('feedback-collector-custom-validation');

	const isDisabled = useNewValidation
		? isSubmitting || disableSubmitButton // New: only disable when submitting or explicitly disabled
		: disableSubmitButton ||
			(showTypeField ? !isTypeSelected() || !hasDescription : !hasDescription); // Old: disable based on form validation

	const getValidationErrors = () => {
		const errors: { type?: string; description?: string } = {};

		// Validate type selection if showTypeField is true
		if (showTypeField && !isTypeSelected()) {
			errors.type = formatMessage(messages.validationErrorTypeRequired);
		}

		// Validate description if showDefaultTextFields is true
		if (showDefaultTextFields && !hasDescription) {
			errors.description = formatMessage(messages.validationErrorDescriptionRequired);
		}

		return errors;
	};

	const getFieldLabels = (
		record?: Partial<Record<SelectValue, SelectOptionDetails>>,
	): Record<SelectValue, React.ReactText> => ({
		bug: record?.bug?.fieldLabel || formatMessage(messages.formBugLabel),
		comment: record?.comment?.fieldLabel || formatMessage(messages.formCommentLabel),
		suggestion: record?.suggestion?.fieldLabel || formatMessage(messages.formSuggestionLabel),
		question: record?.question?.fieldLabel || formatMessage(messages.formQuestionLabel),
		empty: record?.empty?.fieldLabel || formatMessage(messages.formEmptyLabel),
		not_relevant: record?.not_relevant?.fieldLabel || formatMessage(messages.formNotRelevantLabel),
		not_accurate: record?.not_accurate?.fieldLabel || formatMessage(messages.formNotAccurateLabel),
		too_slow: record?.too_slow?.fieldLabel || formatMessage(messages.formTooSlowLabel),
		unhelpful_links:
			record?.unhelpful_links?.fieldLabel || formatMessage(messages.formUnhelpfulLinksLabel),
		other: record?.other?.fieldLabel || formatMessage(messages.formOtherLabel),
	});

	const getSelectOptions = (
		record?: Partial<Record<SelectValue, SelectOptionDetails>>,
	): OptionType[] => [
		{
			label:
				record?.question?.selectOptionLabel || formatMessage(messages.selectionOptionQuestionLabel),
			value: 'question',
		},
		{
			label:
				record?.comment?.selectOptionLabel || formatMessage(messages.selectionOptionCommentLabel),
			value: 'comment',
		},
		{
			label: record?.bug?.selectOptionLabel || formatMessage(messages.selectionOptionBugLabel),
			value: 'bug',
		},
		{
			label:
				record?.suggestion?.selectOptionLabel ||
				formatMessage(messages.selectionOptionSuggestionLabel),
			value: 'suggestion',
		},
	];

	const getDefaultPlaceholder = (record?: Partial<Record<SelectValue, SelectOptionDetails>>) =>
		record?.empty?.selectOptionLabel || formatMessage(messages.selectionOptionDefaultPlaceholder);

	const focusRef = useRef<HTMLElement>();

	const selectOptions =
		customFeedbackOptions.length > 0
			? customFeedbackOptions
			: getSelectOptions(feedbackGroupLabels);

	const renderContactLabelAppify = () => {
		if (fg('jfp_a11y_team_feedback_collector_nested_elements')) {
			return messages.canBeContactedLabelAppifyWithoutLink;
		}

		return messages.canBeContactedLabelAppify;
	};

	const renderContactLabel = () => {
		if (fg('jfp_a11y_team_feedback_collector_nested_elements')) {
			return messages.canBeContactedLabelWithoutLink;
		}

		return messages.canBeContactedLabel;
	};

	const requiredFieldsSummary = (
		// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
		<p
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				color: token('color.text.subtle', N300),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginBottom: token('space.300', '24px'),
			}}
		>
			{formatMessage(messages.requiredFieldsSummary)}
			<RequiredAsterisk />
		</p>
	);

	const feedbackIsAnonymous = (
		// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
		<p>{formatMessage(messages.feedbackIsAnonymous)}</p>
	);

	return (
		<Modal
			shouldCloseOnOverlayClick={false}
			onClose={onClose}
			testId="feedbackCollectorModalDialog"
			shouldReturnFocus={shouldReturnFocusRef}
			shouldScrollInViewport
		>
			{fg('platform-design_system_team-form_conversion') ? (
				<Form
					onSubmit={async () => {
						if (useNewValidation) {
							// New validation: validate on submit and show errors
							const errors = getValidationErrors();

							// If there are validation errors, show them and don't submit
							if (Object.keys(errors).length > 0) {
								setValidationErrors(errors);
								return;
							}
						}

						// Submit the form (both old and new validation paths reach here)
						setIsSubmitting(true);
						try {
							await onSubmit({
								canBeContacted,
								description,
								enrollInResearchGroup,
								type,
							});
						} finally {
							setIsSubmitting(false);
						}
					}}
				>
					<ModalHeader hasCloseButton>
						<ModalTitle>
							{feedbackTitle || <FormattedMessage {...messages.feedbackTitle} />}
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						{fg('ak_feedback_collector_hide_required_summary')
							? showRequiredFieldsSummary && requiredFieldsSummary
							: requiredFieldsSummary}
						{feedbackTitleDetails}
						{customContent}
						{showTypeField ? (
							<Field
								name="topic"
								label={selectLabel || formatMessage(messages.selectionOptionDefaultLabel)}
								isRequired
							>
								{({ fieldProps: { id, ...restProps } }) => (
									<>
										<Select<OptionType>
											{...restProps}
											onChange={(option) => {
												if (!option || option instanceof Array) {
													return;
												}
												setType(option.value);
												// Clear validation error when user selects a type (only for new validation)
												if (useNewValidation && validationErrors.type) {
													setValidationErrors((prev) => ({ ...prev, type: undefined }));
												}
											}}
											menuPortalTarget={document.body}
											styles={{
												menuPortal: (base) => ({
													...base,
													zIndex: 9999,
												}),
											}}
											options={selectOptions}
											// @ts-ignore
											ref={focusRef}
											placeholder={getDefaultPlaceholder(feedbackGroupLabels)}
											inputId={id}
										/>
										{useNewValidation && validationErrors.type && (
											<ErrorMessage>{validationErrors.type}</ErrorMessage>
										)}
									</>
								)}
							</Field>
						) : null}
						{showDefaultTextFields && canShowTextField && (
							<>
								<Field
									label={
										showTypeField
											? getFieldLabels(feedbackGroupLabels)[type]
											: customTextAreaLabel || formatMessage(messages.defaultCustomTextAreaLabel)
									}
									isRequired
									name="description"
								>
									{({ fieldProps }) => (
										<>
											<TextArea
												{...fieldProps}
												name="foo"
												minimumRows={6}
												placeholder={summaryPlaceholder || undefined}
												onChange={(e) => {
													setDescription(e.target.value);
													// Clear validation error when user types
													if (useNewValidation && validationErrors.description) {
														setValidationErrors((prev) => ({ ...prev, description: undefined }));
													}
												}}
												value={description}
											/>
											{useNewValidation && validationErrors.description && (
												<ErrorMessage>{validationErrors.description}</ErrorMessage>
											)}
										</>
									)}
								</Field>
								{(!anonymousFeedback && (
									<Fieldset>
										<legend aria-hidden={false} hidden>
											<FormattedMessage {...messages.optInOptionsLegend} />
										</legend>
										<Field name="can-be-contacted">
											{({ fieldProps }) => (
												<>
													<Checkbox
														{...fieldProps}
														aria-describedby={undefined} // JCA11Y-1988
														label={
															canBeContactedLabel || (
																<FormattedMessage
																	{...(fg('product-terminology-refresh')
																		? renderContactLabelAppify()
																		: renderContactLabel())}
																	{...(!fg('jfp_a11y_team_feedback_collector_nested_elements') && {
																		values: {
																			a: (chunks: React.ReactNode[]) => (
																				<Link
																					href="https://www.atlassian.com/legal/privacy-policy"
																					target="_blank"
																				>
																					{chunks}
																				</Link>
																			),
																		},
																	})}
																/>
															)
														}
														onChange={(event) => setCanBeContacted(event.target.checked)}
													/>
													{canBeContactedLabel &&
														canBeContactedLink &&
														fg('jfp_a11y_team_feedback_collector_nested_elements') && (
															<LinkWrapper>{canBeContactedLink}</LinkWrapper>
														)}
													{!canBeContactedLabel &&
														fg('jfp_a11y_team_feedback_collector_nested_elements') && (
															<LinkWrapper>
																<Link
																	href="https://www.atlassian.com/legal/privacy-policy"
																	target="_blank"
																>
																	{formatMessage(messages.privacyPolicy)}
																</Link>
															</LinkWrapper>
														)}
												</>
											)}
										</Field>
										<Field name="enroll-in-research-group">
											{({ fieldProps }) => (
												<>
													<Checkbox
														{...fieldProps}
														aria-describedby={undefined} // JCA11Y-1988
														label={
															enrolInResearchLabel || formatMessage(messages.enrolInResearchLabel)
														}
														onChange={(event) => setEnrollInResearchGroup(event.target.checked)}
													/>
													{enrolInResearchLabel &&
														enrolInResearchLink &&
														fg('jfp_a11y_team_feedback_collector_nested_elements') && (
															<LinkWrapper>{enrolInResearchLink}</LinkWrapper>
														)}
												</>
											)}
										</Field>
									</Fieldset>
								)) || (
									<>
										<Field name={'anonymousFeedback'}>
											{() => (
												<SectionMessage
													title={formatMessage(messages.feedbackIsAnonymousTitle)}
													appearance={'information'}
												>
													{feedbackIsAnonymous}
												</SectionMessage>
											)}
										</Field>
									</>
								)}
							</>
						)}
					</ModalBody>
					<ModalFooter>
						<Button appearance="subtle" onClick={onClose}>
							{cancelButtonLabel || <FormattedMessage {...messages.cancelButtonLabel} />}
						</Button>
						<Button
							appearance="primary"
							type="submit"
							isDisabled={isSubmitting || isDisabled}
							testId="feedbackCollectorSubmitBtn"
						>
							{submitButtonLabel || <FormattedMessage {...messages.submitButtonLabel} />}
						</Button>
					</ModalFooter>
				</Form>
			) : (
				<Form
					onSubmit={async () => {
						if (useNewValidation) {
							// New validation: validate on submit and show errors
							const errors = getValidationErrors();

							// If there are validation errors, show them and don't submit
							if (Object.keys(errors).length > 0) {
								setValidationErrors(errors);
								return;
							}
						}

						// Submit the form (both old and new validation paths reach here)
						setIsSubmitting(true);
						try {
							await onSubmit({
								canBeContacted,
								description,
								enrollInResearchGroup,
								type,
							});
						} finally {
							setIsSubmitting(false);
						}
					}}
				>
					{({ formProps }) => (
						<form {...formProps}>
							<ModalHeader hasCloseButton>
								<ModalTitle>
									{feedbackTitle || <FormattedMessage {...messages.feedbackTitle} />}
								</ModalTitle>
							</ModalHeader>
							<ModalBody>
								{fg('ak_feedback_collector_hide_required_summary')
									? showRequiredFieldsSummary && requiredFieldsSummary
									: requiredFieldsSummary}
								{feedbackTitleDetails}
								{customContent}
								{showTypeField ? (
									<Field
										name="topic"
										label={selectLabel || formatMessage(messages.selectionOptionDefaultLabel)}
										isRequired
									>
										{({ fieldProps: { id, ...restProps } }) => (
											<>
												<Select<OptionType>
													{...restProps}
													onChange={(option) => {
														if (!option || option instanceof Array) {
															return;
														}
														setType(option.value);
														// Clear validation error when user selects a type (only for new validation)
														if (useNewValidation && validationErrors.type) {
															setValidationErrors((prev) => ({ ...prev, type: undefined }));
														}
													}}
													menuPortalTarget={document.body}
													styles={{
														menuPortal: (base) => ({
															...base,
															zIndex: 9999,
														}),
													}}
													options={selectOptions}
													// @ts-ignore
													ref={focusRef}
													placeholder={getDefaultPlaceholder(feedbackGroupLabels)}
													inputId={id}
												/>
												{useNewValidation && validationErrors.type && (
													<ErrorMessage>{validationErrors.type}</ErrorMessage>
												)}
											</>
										)}
									</Field>
								) : null}
								{showDefaultTextFields && canShowTextField && (
									<>
										<Field
											label={
												showTypeField
													? getFieldLabels(feedbackGroupLabels)[type]
													: customTextAreaLabel ||
														formatMessage(messages.defaultCustomTextAreaLabel)
											}
											isRequired
											name="description"
										>
											{({ fieldProps }) => (
												<>
													<TextArea
														{...fieldProps}
														name="foo"
														minimumRows={6}
														placeholder={summaryPlaceholder || undefined}
														onChange={(e) => {
															setDescription(e.target.value);
															// Clear validation error when user types
															if (useNewValidation && validationErrors.description) {
																setValidationErrors((prev) => ({
																	...prev,
																	description: undefined,
																}));
															}
														}}
														value={description}
													/>
													{useNewValidation && validationErrors.description && (
														<ErrorMessage>{validationErrors.description}</ErrorMessage>
													)}
												</>
											)}
										</Field>
										{(!anonymousFeedback && (
											<Fieldset>
												<legend aria-hidden={false} hidden>
													<FormattedMessage {...messages.optInOptionsLegend} />
												</legend>
												<Field name="can-be-contacted">
													{({ fieldProps }) => (
														<>
															<Checkbox
																{...fieldProps}
																aria-describedby={undefined} // JCA11Y-1988
																label={
																	canBeContactedLabel || (
																		<FormattedMessage
																			{...(fg('product-terminology-refresh')
																				? renderContactLabelAppify()
																				: renderContactLabel())}
																			{...(!fg(
																				'jfp_a11y_team_feedback_collector_nested_elements',
																			) && {
																				values: {
																					a: (chunks: React.ReactNode[]) => (
																						<Link
																							href="https://www.atlassian.com/legal/privacy-policy"
																							target="_blank"
																						>
																							{chunks}
																						</Link>
																					),
																				},
																			})}
																		/>
																	)
																}
																onChange={(event) => setCanBeContacted(event.target.checked)}
															/>
															{canBeContactedLabel &&
																canBeContactedLink &&
																fg('jfp_a11y_team_feedback_collector_nested_elements') && (
																	<LinkWrapper>{canBeContactedLink}</LinkWrapper>
																)}
															{!canBeContactedLabel &&
																fg('jfp_a11y_team_feedback_collector_nested_elements') && (
																	<LinkWrapper>
																		<Link
																			href="https://www.atlassian.com/legal/privacy-policy"
																			target="_blank"
																		>
																			{formatMessage(messages.privacyPolicy)}
																		</Link>
																	</LinkWrapper>
																)}
														</>
													)}
												</Field>
												<Field name="enroll-in-research-group">
													{({ fieldProps }) => (
														<>
															<Checkbox
																{...fieldProps}
																aria-describedby={undefined} // JCA11Y-1988
																label={
																	enrolInResearchLabel ||
																	formatMessage(messages.enrolInResearchLabel)
																}
																onChange={(event) => setEnrollInResearchGroup(event.target.checked)}
															/>
															{enrolInResearchLabel &&
																enrolInResearchLink &&
																fg('jfp_a11y_team_feedback_collector_nested_elements') && (
																	<LinkWrapper>{enrolInResearchLink}</LinkWrapper>
																)}
														</>
													)}
												</Field>
											</Fieldset>
										)) || (
											<>
												<Field name={'anonymousFeedback'}>
													{() => (
														<SectionMessage
															title={formatMessage(messages.feedbackIsAnonymousTitle)}
															appearance={'information'}
														>
															{feedbackIsAnonymous}
														</SectionMessage>
													)}
												</Field>
											</>
										)}
									</>
								)}
							</ModalBody>
							<ModalFooter>
								<Button appearance="subtle" onClick={onClose}>
									{cancelButtonLabel || <FormattedMessage {...messages.cancelButtonLabel} />}
								</Button>
								<Button
									appearance="primary"
									type="submit"
									isDisabled={isSubmitting || isDisabled}
									testId="feedbackCollectorSubmitBtn"
								>
									{submitButtonLabel || <FormattedMessage {...messages.submitButtonLabel} />}
								</Button>
							</ModalFooter>
						</form>
					)}
				</Form>
			)}
		</Modal>
	);
};

const FeedbackFormWithIntl: FunctionComponent<Props & { locale: string }> = ({
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
