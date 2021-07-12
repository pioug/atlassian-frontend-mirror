import React, { useState } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  useAnalyticsEvents,
  UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';
import SectionMessage from '@atlaskit/section-message';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import Form, { Field, CheckboxField, FormFooter } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import { Checkbox } from '@atlaskit/checkbox';
import TextArea from '@atlaskit/textarea';
import { gridSize } from '@atlaskit/theme/constants';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

import {
  name as packageName,
  version as packageVersion,
} from '../../../../version.json';
import { messages } from '../../../../messages';
import { ArticleFeedback } from '../../../../model/Article';

import ArticleWasHelpfulYesButton from './WasHelpfulYesButton';
import ArticleWasHelpfulNoButton from './WasHelpfulNoButton';

import {
  ArticleFeedbackContainer,
  ArticleFeedbackText,
  ArticleFeedbackAnswerWrapper,
} from './styled';

const FEEDBACK_REASON_TEXT_MAX_LENGTH = '16000';
const ANALYTICS_CONTEXT_DATA = {
  componentName: 'ArticleWasHelpfulForm',
  packageName,
  packageVersion,
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

export const ArticleWasHelpfulForm: React.FC<Props & InjectedIntlProps> = ({
  onWasHelpfulSubmit,
  onWasHelpfulYesButtonClick,
  onWasHelpfulNoButtonClick,
  intl: { formatMessage },
}) => {
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const [feedbackReason, setFeedbackReason] = useState<string>('');
  const [feedbackReasonText, setFeedbackReasonText] = useState<string>('');
  const [contactMe, setContactMe] = useState<boolean>(false);
  const [wasHelpfulFormSubmited, setWasHelpfulFormSubmited] = useState<boolean>(
    false,
  );
  const [
    wasHelpfulFormSubmitLoading,
    setWasHelpfulFormSubmitLoading,
  ] = useState<boolean>(false);
  const [
    wasHelpfulFormSubmitedFailed,
    setWasHelpfulFormSubmitedFailed,
  ] = useState<boolean>(false);
  const { createAnalyticsEvent } = useAnalyticsEvents();

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
    ((
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void => {
      if (onWasHelpfulYesButtonClick) {
        onWasHelpfulYesButtonClick(event, analyticsEvent);
      }

      setWasHelpful(true);
    });

  const handleArticleWasHelpfulNoButtonClick =
    (onWasHelpfulNoButtonClick || onWasHelpfulSubmit) &&
    ((
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void => {
      if (onWasHelpfulNoButtonClick) {
        onWasHelpfulNoButtonClick(event, analyticsEvent);
      }

      setWasHelpful(false);
    });

  const radioGroupReasonOnChange = (event: React.SyntheticEvent<any>): void => {
    setFeedbackReason(event.currentTarget.value);
  };

  const feedbackReasonTextOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setFeedbackReasonText(event.currentTarget.value);
  };

  const checkboxContactMeOnChange = (
    event: React.SyntheticEvent<any>,
  ): void => {
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
      (handleArticleWasHelpfulYesButtonClick ||
        handleArticleWasHelpfulNoButtonClick) &&
      !wasHelpfulFormSubmited
    ) {
      return (
        <>
          <ArticleFeedbackContainer>
            <ArticleFeedbackText style={{ paddingRight: `${gridSize()}px` }}>
              {formatMessage(messages.help_article_rating_title)}
            </ArticleFeedbackText>
            <ButtonGroup>
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
                      <ArticleFeedbackText>
                        {formatMessage(messages.help_article_rating_form_title)}
                      </ArticleFeedbackText>
                      {!wasHelpful && (
                        <Field name="feedbackReason" isRequired>
                          {({ fieldProps }: { fieldProps: any }) => (
                            <RadioGroup
                              {...fieldProps}
                              options={negativeFeedbackReason}
                              onChange={radioGroupReasonOnChange}
                            />
                          )}
                        </Field>
                      )}
                      <Field name="feedbackReasonText" defaultValue="">
                        {({ fieldProps }: { fieldProps: any }) => (
                          <TextArea
                            {...fieldProps}
                            minimumRows={4}
                            maxLength={FEEDBACK_REASON_TEXT_MAX_LENGTH}
                            value={feedbackReasonText}
                            onChange={feedbackReasonTextOnChange}
                          />
                        )}
                      </Field>

                      <CheckboxField name="contactMe">
                        {({ fieldProps }) => (
                          <Checkbox
                            {...fieldProps}
                            isChecked={contactMe}
                            onChange={checkboxContactMeOnChange}
                            label={formatMessage(
                              messages.help_article_rating_form_contact_me,
                            )}
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
                            {formatMessage(
                              messages.help_article_rating_form_submit,
                            )}
                          </Button>
                          <Button onClick={onFeedbackSubmitCancel}>
                            {formatMessage(
                              messages.help_article_rating_form_cancel,
                            )}
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
              paddingRight: `${gridSize()}px`,
              verticalAlign: 'middle',
            }}
          >
            <CheckCircleIcon primaryColor={colors.G400} label="" />
          </span>
          <ArticleFeedbackText>
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
              <p>{formatMessage(messages.help_article_rating_form_failed)}</p>
              <p>
                <Button
                  appearance="link"
                  spacing="compact"
                  css={{ padding: '0', '& span': { margin: '0' } }}
                  onClick={handleTryAgainOnClick}
                >
                  {formatMessage(
                    messages.help_article_rating_form_failed_try_again,
                  )}
                </Button>
              </p>
            </SectionMessage>
          </ArticleFeedbackContainer>
        )}
      </>
    );
  }

  return null;
};

const ArticleWasHelpfulFormWithContext: React.FC<Props & InjectedIntlProps> = (
  props,
) => {
  return (
    <AnalyticsContext data={ANALYTICS_CONTEXT_DATA}>
      <ArticleWasHelpfulForm {...props} />
    </AnalyticsContext>
  );
};

export default injectIntl(ArticleWasHelpfulFormWithContext);
