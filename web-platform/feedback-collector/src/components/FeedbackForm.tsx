import React, { type FunctionComponent, useRef, useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { Field, Fieldset, RequiredAsterisk } from '@atlaskit/form';
import EditorCloseIcon from '@atlaskit/icon/core/migration/close--editor-close';
import Link from '@atlaskit/link';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import SectionMessage from '@atlaskit/section-message';
import Select from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';
import { N300, N500 } from '@atlaskit/theme/colors';
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
}

export interface OptionType {
	label: React.ReactText;
	value: SelectValue;
}

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
	enrolInResearchLabel,
	submitButtonLabel,
	cancelButtonLabel,
	anonymousFeedback,
	hasDescriptionDefaultValue,
	selectLabel,
	customTextAreaLabel,
	customFeedbackOptions = [],
	shouldReturnFocusRef,
}) => {
	const [canBeContacted, setCanBeContacted] = useState<FormFields['canBeContacted']>(false);
	const [description, setDescription] = useState<FormFields['description']>('');
	const [enrollInResearchGroup, setEnrollInResearchGroup] =
		useState<FormFields['enrollInResearchGroup']>(false);
	const [type, setType] = useState<FormFields['type']>('empty');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { formatMessage } = useIntl();
	const isTypeSelected = () => type !== 'empty';

	const canShowTextField = isTypeSelected() || !showTypeField;

	const hasDescription = description || hasDescriptionDefaultValue;
	const isDisabled = showTypeField ? !isTypeSelected() || !hasDescription : !hasDescription;

	const getFieldLabels = (
		record?: Record<SelectValue, SelectOptionDetails>,
	): Record<SelectValue, React.ReactText> => ({
		bug: record?.bug.fieldLabel || formatMessage(messages.formBugLabel),
		comment: record?.comment.fieldLabel || formatMessage(messages.formCommentLabel),
		suggestion: record?.suggestion.fieldLabel || formatMessage(messages.formSuggestionLabel),
		question: record?.question.fieldLabel || formatMessage(messages.formQuestionLabel),
		empty: record?.empty.fieldLabel || formatMessage(messages.formEmptyLabel),
	});

	const getSelectOptions = (record?: Record<SelectValue, SelectOptionDetails>): OptionType[] => [
		{
			label:
				record?.question.selectOptionLabel || formatMessage(messages.selectionOptionQuestionLabel),
			value: 'question',
		},
		{
			label:
				record?.comment.selectOptionLabel || formatMessage(messages.selectionOptionCommentLabel),
			value: 'comment',
		},
		{
			label: record?.bug.selectOptionLabel || formatMessage(messages.selectionOptionBugLabel),
			value: 'bug',
		},
		{
			label:
				record?.suggestion.selectOptionLabel ||
				formatMessage(messages.selectionOptionSuggestionLabel),
			value: 'suggestion',
		},
	];

	const getDefaultPlaceholder = (record?: Record<SelectValue, SelectOptionDetails>) =>
		record?.empty.selectOptionLabel || formatMessage(messages.selectionOptionDefaultPlaceholder);

	const focusRef = useRef<HTMLElement>();

	const selectOptions =
		customFeedbackOptions.length > 0
			? customFeedbackOptions
			: getSelectOptions(feedbackGroupLabels);

	return (
		<Modal
			shouldCloseOnOverlayClick={false}
			onClose={onClose}
			testId="feedbackCollectorModalDialog"
			shouldReturnFocus={shouldReturnFocusRef}
		>
			<Form
				onSubmit={async () => {
					setIsSubmitting(true);
					await onSubmit({
						canBeContacted,
						description,
						enrollInResearchGroup,
						type,
					});
					setIsSubmitting(false);
				}}
			>
				{({ formProps }) => (
					<form {...formProps}>
						<ModalHeader>
							<ModalTitle>
								{feedbackTitle || <FormattedMessage {...messages.feedbackTitle} />}
							</ModalTitle>
							<Button
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								style={{ lineHeight: 'normal' }}
								spacing={'none'}
								onClick={onClose}
								appearance={'subtle'}
							>
								<EditorCloseIcon
									spacing="spacious"
									label="Close Modal"
									color={token('color.text.subtle', N500)}
								/>
							</Button>
						</ModalHeader>
						<ModalBody>
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
							{feedbackTitleDetails}
							{customContent}
							{showTypeField ? (
								<Field
									name="topic"
									label={selectLabel || formatMessage(messages.selectionOptionDefaultLabel)}
									isRequired
									aria-required={true} // JCA11Y-1619
								>
									{({ fieldProps: { id, ...restProps } }) => (
										<Select<OptionType>
											{...restProps}
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
											options={selectOptions}
											// @ts-ignore
											ref={focusRef}
											placeholder={getDefaultPlaceholder(feedbackGroupLabels)}
											inputId={id}
										/>
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
											<TextArea
												{...fieldProps}
												name="foo"
												minimumRows={6}
												placeholder={summaryPlaceholder || undefined}
												onChange={(e) => setDescription(e.target.value)}
												value={description}
											/>
										)}
									</Field>
									{(!anonymousFeedback && (
										<Fieldset>
											<legend aria-hidden={false} hidden>
												Atlassian opt-in options
											</legend>
											<Field name="can-be-contacted">
												{({ fieldProps }) => (
													<Checkbox
														{...fieldProps}
														aria-describedby={undefined} // JCA11Y-1988
														label={
															canBeContactedLabel || (
																<FormattedMessage
																	{...messages.canBeContactedLabel}
																	values={{
																		a: (chunks: React.ReactNode[]) =>
																			fg('underlined_iph_links') ? (
																				<Link
																					href="https://www.atlassian.com/legal/privacy-policy"
																					target="_blank"
																				>
																					{chunks}
																				</Link>
																			) : (
																				<a
																					href="https://www.atlassian.com/legal/privacy-policy"
																					target="_blank"
																				>
																					{chunks}
																				</a>
																			),
																	}}
																/>
															)
														}
														onChange={(event) => setCanBeContacted(event.target.checked)}
													/>
												)}
											</Field>

											<Field name="enroll-in-research-group">
												{({ fieldProps }) => (
													<Checkbox
														{...fieldProps}
														aria-describedby={undefined} // JCA11Y-1988
														label={
															enrolInResearchLabel || formatMessage(messages.enrolInResearchLabel)
														}
														onChange={(event) => setEnrollInResearchGroup(event.target.checked)}
													/>
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
														<p>{formatMessage(messages.feedbackIsAnonymous)}</p>
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
