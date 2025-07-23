/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/** @jsxFrag */

import React, { useRef, useState } from 'react';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import {
	useAnalyticsEvents,
	type UIAnalyticsEvent,
	AnalyticsContext,
} from '@atlaskit/analytics-next';
import SectionMessage from '@atlaskit/section-message';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import Form, { Field, CheckboxField, FormFooter } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import { Checkbox } from '@atlaskit/checkbox';
import TextArea from '@atlaskit/textarea';
import { token } from '@atlaskit/tokens';
import CheckCircleIcon from '@atlaskit/icon/core/migration/status-success--check-circle';
import { colors } from '@atlaskit/theme';
import { css, jsx } from '@compiled/react';
import { Text } from '@atlaskit/primitives/compiled';

import { messages } from '../../../../messages';
import { type ArticleFeedback } from '../../../../model/Article';
import ArticleWasHelpfulYesButton from './WasHelpfulYesButton';
import ArticleWasHelpfulNoButton from './WasHelpfulNoButton';
import {
	ArticleFeedbackContainer,
	ArticleFeedbackText,
	ArticleFeedbackAnswerWrapper,
} from './styled';
import { fg } from '@atlaskit/platform-feature-flags';

const FEEDBACK_REASON_TEXT_MAX_LENGTH = '16000';
const ANALYTICS_CONTEXT_DATA = {
	componentName: 'ArticleWasHelpfulForm',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};

interface Props {
	// Event handler for the "Was this helpful" submit button. This prop is optional, if is not defined the "Was this helpful" section will be hidden
	onWasHelpfulSubmit?(
		analyticsEvent: UIAnalyticsEvent,
		articleFeedback: ArticleFeedback,
	): Promise<boolean>;
	// Event handler for the "Yes" button of the "Was this helpful" section. This prop is optional
	onWasHelpfulYesButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	// Event handler for the "No" button of the "Was this helpful" section. This prop is optional
	onWasHelpfulNoButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
}

const buttonStyles = css({
	padding: '0',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& span': { margin: '0' },
});

export const ArticleWasHelpfulForm: React.FC<Props & WrappedComponentProps> = ({
	onWasHelpfulSubmit,
	onWasHelpfulYesButtonClick,
	onWasHelpfulNoButtonClick,
	intl: { formatMessage },
}) => {
	const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
	const [feedbackReason, setFeedbackReason] = useState<string>('');
	const [feedbackReasonText, setFeedbackReasonText] = useState<string>('');
	const [contactMe, setContactMe] = useState<boolean>(false);
	const [wasHelpfulFormSubmited, setWasHelpfulFormSubmited] = useState<boolean>(false);
	const [wasHelpfulFormSubmitLoading, setWasHelpfulFormSubmitLoading] = useState<boolean>(false);
	const [wasHelpfulFormSubmitedFailed, setWasHelpfulFormSubmitedFailed] = useState<boolean>(false);
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const wasHelpfulFormClickedButtonRef = useRef<HTMLElement | null>(null);

	const negativeFeedbackReason = [
		{
			name: 'negativeFeedbackReason',
			value: 'noAccurate',
			label: formatMessage(messages.help_article_rating_accurate),
		},
		{
			name: 'negativeFeedbackReason',
			value: 'noClear',
			label: formatMessage(messages.help_article_rating_clear),
		},
		{
			name: 'negativeFeedbackReason',
			value: 'noRelevant',
			label: formatMessage(messages.help_article_rating_relevant),
		},
	];

	const handleArticleWasHelpfulYesButtonClick =
		(onWasHelpfulYesButtonClick || onWasHelpfulSubmit) &&
		((event: React.MouseEvent<HTMLElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent): void => {
			if (onWasHelpfulYesButtonClick) {
				onWasHelpfulYesButtonClick(event, analyticsEvent);
			}

			setWasHelpful(true);
			wasHelpfulFormClickedButtonRef.current = event.currentTarget;
		});

	const handleArticleWasHelpfulNoButtonClick =
		(onWasHelpfulNoButtonClick || onWasHelpfulSubmit) &&
		((event: React.MouseEvent<HTMLElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent): void => {
			if (onWasHelpfulNoButtonClick) {
				onWasHelpfulNoButtonClick(event, analyticsEvent);
			}

			setWasHelpful(false);
			wasHelpfulFormClickedButtonRef.current = event.currentTarget;
		});

	const radioGroupReasonOnChange = (event: React.SyntheticEvent<any>): void => {
		setFeedbackReason(event.currentTarget.value);
	};

	const feedbackReasonTextOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
		setFeedbackReasonText(event.currentTarget.value);
	};

	const checkboxContactMeOnChange = (event: React.SyntheticEvent<any>): void => {
		setContactMe(event.currentTarget.checked);
	};

	const onFeedbackSubmitClick = (): void => {
		const feedback = {
			wasHelpful: wasHelpful!,
			feedbackReason,
			feedbackReasonText,
			contactMe,
		};

		onFeedbackSubmit(feedback);
	};

	const onFeedbackSubmit = (articleFeedback: ArticleFeedback): void => {
		if (onWasHelpfulSubmit) {
			const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
				action: 'clicked',
			});

			setWasHelpfulFormSubmitLoading(true);

			onWasHelpfulSubmit(analyticsEvent, articleFeedback)
				.then(() => {
					setWasHelpfulFormSubmitLoading(false);
					setWasHelpfulFormSubmitedFailed(false);
					setWasHelpfulFormSubmited(true);
					setWasHelpful(null);
					setFeedbackReason('');
					setFeedbackReasonText('');
					setContactMe(false);
				})
				.catch(() => {
					setWasHelpfulFormSubmitLoading(false);
					setWasHelpfulFormSubmitedFailed(true);
					setWasHelpfulFormSubmited(true);
				});
		}
	};

	const onFeedbackSubmitCancel = (): void => {
		setWasHelpful(null);
		wasHelpfulFormClickedButtonRef.current?.focus?.();
	};

	const handleTryAgainOnClick = () => {
		const feedback = {
			wasHelpful: wasHelpful!,
			feedbackReason,
			feedbackReasonText,
			contactMe,
		};
		onFeedbackSubmit(feedback);
	};

	if (!wasHelpfulFormSubmitedFailed) {
		if (
			(handleArticleWasHelpfulYesButtonClick || handleArticleWasHelpfulNoButtonClick) &&
			!wasHelpfulFormSubmited
		) {
			return (
				<>
					<ArticleFeedbackContainer>
						<ArticleFeedbackText paddingRight={token('space.100', '8px')}>
							{formatMessage(messages.help_article_rating_title)}
						</ArticleFeedbackText>
						<ButtonGroup
							{...(fg('jfp_a11y_fix_sr_accessibility_for_button_group')
								? { label: formatMessage(messages.help_article_rating_title) }
								: {})}
						>
							{handleArticleWasHelpfulYesButtonClick && (
								<ArticleWasHelpfulYesButton
									onClick={handleArticleWasHelpfulYesButtonClick}
									isSelected={wasHelpful === true}
								/>
							)}
							{handleArticleWasHelpfulNoButtonClick && (
								<ArticleWasHelpfulNoButton
									onClick={handleArticleWasHelpfulNoButtonClick}
									isSelected={wasHelpful === false}
								/>
							)}
						</ButtonGroup>
					</ArticleFeedbackContainer>
					{wasHelpful !== null && onWasHelpfulSubmit && (
						<ArticleFeedbackAnswerWrapper>
							<Form onSubmit={onFeedbackSubmitClick}>
								{({ formProps }: { formProps: any }) => {
									return (
										<form {...formProps} name="form-example">
											{!wasHelpful && (
												<fieldset>
													<legend
														id="feedbackReason-label"
														style={{
															// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
															position: 'absolute',
															// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
															width: '1px',
															// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
															height: '1px',
															// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
															margin: '-1px',
															// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
															padding: '0',
															// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
															border: '0',
															// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
															clip: 'rect(0, 0, 0, 0)',
															// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
															overflow: 'hidden',
														}}
													>
														{formatMessage(messages.help_article_rating_form_title)}
													</legend>
													<Field name="feedbackReason" isRequired>
														{({ fieldProps }: { fieldProps: any }) => (
															<RadioGroup
																{...fieldProps}
																options={negativeFeedbackReason}
																onChange={radioGroupReasonOnChange}
																aria-labelledby="feedbackReason-label"
															/>
														)}
													</Field>
												</fieldset>
											)}
											<Field name="feedbackReasonText" defaultValue="">
												{({ fieldProps }: { fieldProps: any }) => (
													<>
														<ArticleFeedbackText
															id="articleFeedbackText"
															top={token('space.negative.100', '-8px')}
														>
															{formatMessage(messages.help_article_rating_form_title)}
														</ArticleFeedbackText>
														<TextArea
															{...fieldProps}
															minimumRows={4}
															aria-labelledby="articleFeedbackText"
															maxLength={FEEDBACK_REASON_TEXT_MAX_LENGTH}
															value={feedbackReasonText}
															onChange={feedbackReasonTextOnChange}
														/>
													</>
												)}
											</Field>

											<CheckboxField name="contactMe">
												{({ fieldProps }) => (
													<Checkbox
														{...fieldProps}
														isChecked={contactMe}
														onChange={checkboxContactMeOnChange}
														label={formatMessage(messages.help_article_rating_form_contact_me)}
													/>
												)}
											</CheckboxField>

											<FormFooter>
												<ButtonGroup>
													<Button
														type="submit"
														appearance="primary"
														isDisabled={!wasHelpful && feedbackReason === ''}
														isLoading={wasHelpfulFormSubmitLoading}
													>
														{formatMessage(messages.help_article_rating_form_submit)}
													</Button>
													<Button onClick={onFeedbackSubmitCancel}>
														{formatMessage(messages.help_article_rating_form_cancel)}
													</Button>
												</ButtonGroup>
											</FormFooter>
										</form>
									);
								}}
							</Form>
						</ArticleFeedbackAnswerWrapper>
					)}
				</>
			);
		} else if (wasHelpfulFormSubmited && wasHelpful === null) {
			return (
				<ArticleFeedbackContainer>
					<span
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							paddingRight: token('space.100', '8px'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							verticalAlign: 'middle',
						}}
						role="img"
						aria-label="Success"
					>
						<CheckCircleIcon
							spacing="spacious"
							color={token('color.icon.success', colors.G400)}
							label=""
						/>
					</span>
					<ArticleFeedbackText role="alert" aria-live="polite">
						{formatMessage(messages.help_article_rating_form_Success)}
					</ArticleFeedbackText>
				</ArticleFeedbackContainer>
			);
		}
	} else if (wasHelpfulFormSubmited && wasHelpfulFormSubmitedFailed) {
		return (
			<>
				{wasHelpfulFormSubmited && wasHelpfulFormSubmitedFailed && (
					<ArticleFeedbackContainer>
						<SectionMessage appearance="warning">
							<Text as="p">{formatMessage(messages.help_article_rating_form_failed)}</Text>
							<Text as="p">
								<Button
									appearance="link"
									spacing="compact"
									css={buttonStyles}
									onClick={handleTryAgainOnClick}
								>
									{formatMessage(messages.help_article_rating_form_failed_try_again)}
								</Button>
							</Text>
						</SectionMessage>
					</ArticleFeedbackContainer>
				)}
			</>
		);
	}

	return null;
};

const ArticleWasHelpfulFormWithContext: React.FC<Props & WrappedComponentProps> = (props) => {
	return (
		<AnalyticsContext data={ANALYTICS_CONTEXT_DATA}>
			<ArticleWasHelpfulForm {...props} />
		</AnalyticsContext>
	);
};

export default injectIntl(ArticleWasHelpfulFormWithContext);
