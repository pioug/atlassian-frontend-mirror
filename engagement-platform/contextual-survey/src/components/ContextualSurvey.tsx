import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FormApi, OnSubmitHandler } from '@atlaskit/form';

import { FormValues } from '../types';

import FeedbackAcknowledgement from './FeedbackAcknowledgement';
import SignUpPrompt from './SignUpPrompt';
import SignUpSuccess from './SignUpSuccess';
import SurveyContainer from './SurveyContainer';
import SurveyForm from './SurveyForm';
import useEscapeToDismiss from './useEscapeToDismiss';

export enum DismissTrigger {
  AutoDismiss = 'AUTO_DISMISS',
  Manual = 'MANUAL',
  Finished = 'FINISHED',
  Unmount = 'UNMOUNT',
}

export type OnDismissArgs = { trigger: DismissTrigger };

interface Props {
  /** Optional statement, to be used in conjunction with the question for the survey
   * Example: "How strongly do you agree or disagree with this statement"
   */
  statement?: string;
  /** Question used for the survey
   * Example: "It is easy to find what I am looking for in Jira"
   */
  question: string;
  /** Accessible label text for the survey text area */
  textLabel?: string;
  /** Text placeholder for the survey text area
   * Example: "Tell us why"
   */
  textPlaceholder?: string;
  /** Callback that is triggered when the survey should be dismissed */
  onDismiss: (args: OnDismissArgs) => void;
  /** Gets whether user has already signed up to the Atlassian Research Group list.
   * If `true` is returned then the user will not be prompted to sign up to the Research Group.
   */
  getUserHasAnsweredMailingList: () => Promise<boolean>;
  /** Callback that is triggered when the survey is submitted, it will get the survey data as a parameter */
  onSubmit: (formValues: FormValues) => Promise<void>;
  /** Callback that is triggered when the user clicks 'Yes' or 'No' to sign up to the Atlassian Research Group */
  onMailingListAnswer: (answer: boolean) => Promise<void>;
}

type Step =
  | 'SURVEY'
  | 'SIGN_UP_PROMPT'
  | 'SIGN_UP_SUCCESS'
  | 'POST_SURVEY_NO_CONSENT'
  | 'POST_SURVEY_HAS_SIGN_UP';

type Optional<T> = T | null;

export const AUTO_DISAPPEAR_DURATION: number = 8000;

export default ({
  question,
  statement,
  onDismiss,
  onSubmit,
  onMailingListAnswer,
  getUserHasAnsweredMailingList,
  textLabel = 'Why did you give that rating',
  textPlaceholder = 'Tell us why',
}: Props) => {
  const autoDisappearTimeoutRef = useRef<Optional<number>>(null);

  // only allow a single dismiss for a component
  const isDismissedRef = useRef<boolean>(false);
  const tryDismiss = useCallback((trigger: DismissTrigger) => {
    // Already called dismiss once
    if (isDismissedRef.current) {
      return;
    }
    isDismissedRef.current = true;
    onDismissRef.current({ trigger });
  }, []);

  const [currentStep, setCurrentStep] = useState<Step>('SURVEY');
  const trySetCurrentStep = useCallback(
    (step: Step) => {
      // Already dismissed - cannot update the step
      if (isDismissedRef.current) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log(
            `not setting step "${step}" as survey is already dismissed`,
          );
        }
        return;
      }

      setCurrentStep(step);
    },
    [setCurrentStep],
  );

  // using a ref so that we don't break all of our caches if a consumer is using an arrow function
  const onDismissRef = useRef<(args: OnDismissArgs) => void>(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  const tryClearTimeout = useCallback(() => {
    const id: Optional<number> = autoDisappearTimeoutRef.current;

    if (id) {
      clearTimeout(id);
      autoDisappearTimeoutRef.current = null;
    }
  }, []);

  // Cleanup any auto dismiss after dismiss
  useEffect(() => {
    return function unmount() {
      tryClearTimeout();
      tryDismiss(DismissTrigger.Unmount);
    };
  }, [tryClearTimeout, tryDismiss]);

  const onSurveySubmit = useCallback<OnSubmitHandler<FormValues>>(
    async (
      formValues: FormValues,
      form: FormApi<FormValues>,
      callback = () => {},
    ) => {
      // Submitting form: Phase 1 complete
      await onSubmit(formValues);

      // Note: need to call callback just before we navigate away
      // It cleans up the form (required)

      // Optional Phase 2: Asking to join Atlassian Research Group
      // Only enter phase 2 if:
      // 1. not already dismissed; AND
      // 2. permission given to contact; AND
      // 3. user has previously not answered mailing list question (getUserHasAnsweredMailingList returns false)

      // Not entering phase 2: User has dismissed while the submit promise was resolving
      if (isDismissedRef.current) {
        callback();
        return;
      }

      // Not entering phase 2: no permission given to respond to feedback
      if (!formValues.canContact) {
        callback();
        trySetCurrentStep('POST_SURVEY_NO_CONSENT');
        return;
      }

      const userHasAnswered: boolean = await getUserHasAnsweredMailingList();
      callback();

      // Not entering phase 2: user has already answered this question
      if (userHasAnswered) {
        trySetCurrentStep('POST_SURVEY_HAS_SIGN_UP');
        return;
      }

      // Enter phase 2
      trySetCurrentStep('SIGN_UP_PROMPT');
    },
    [getUserHasAnsweredMailingList, onSubmit, trySetCurrentStep],
  );

  const onMailingListResponse = useCallback(
    async (answer: boolean) => {
      await onMailingListAnswer(answer);
      if (answer) {
        trySetCurrentStep('SIGN_UP_SUCCESS');
        return;
      }
      // We have already thanked to user, we can simply close
      tryDismiss(DismissTrigger.Finished);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tryDismiss, trySetCurrentStep],
  );

  // Start the auto disappear when we are finished
  useEffect(() => {
    // Already dismissed
    if (isDismissedRef.current) {
      return;
    }

    // Timeout already scheduled
    if (autoDisappearTimeoutRef.current) {
      return;
    }

    if (
      [
        'SIGN_UP_SUCCESS',
        'POST_SURVEY_NO_CONSENT',
        'POST_SURVEY_HAS_SIGN_UP',
      ].includes(currentStep)
    ) {
      autoDisappearTimeoutRef.current = window.setTimeout(
        () => tryDismiss(DismissTrigger.AutoDismiss),
        AUTO_DISAPPEAR_DURATION,
      );
    }
  }, [currentStep, tryDismiss]);

  useEscapeToDismiss({ onDismiss: () => tryDismiss(DismissTrigger.Manual) });

  const content = (() => {
    if (currentStep === 'SURVEY') {
      return (
        <SurveyForm
          question={question}
          statement={statement}
          textLabel={textLabel}
          textPlaceholder={textPlaceholder}
          onSubmit={onSurveySubmit}
        />
      );
    }
    if (currentStep === 'SIGN_UP_PROMPT') {
      return <SignUpPrompt onAnswer={onMailingListResponse} />;
    }
    if (currentStep === 'SIGN_UP_SUCCESS') {
      return <SignUpSuccess />;
    }
    if (
      currentStep === 'POST_SURVEY_NO_CONSENT' ||
      currentStep === 'POST_SURVEY_HAS_SIGN_UP'
    ) {
      return <FeedbackAcknowledgement />;
    }

    return null;
  })();

  const manualDismiss = useCallback(() => {
    // clear any pending timers
    tryClearTimeout();
    tryDismiss(DismissTrigger.Manual);
  }, [tryDismiss, tryClearTimeout]);

  return <SurveyContainer onDismiss={manualDismiss}>{content}</SurveyContainer>;
};
