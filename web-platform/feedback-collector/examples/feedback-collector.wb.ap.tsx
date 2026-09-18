import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as FeedbackFormExample } from './01-feedback-form';
import { default as FeedbackCollectorExample } from './02-feedback-collector';
import { default as FeedbackButtonExample } from './03-feedback-button';
import { default as CustomFeedbackCollectorExample } from './04-custom-feedback-collector';
import { default as FeedbackCollectorWithCustomStylesExample } from './05-feedback-collector-with-custom-styles';
import { default as FeedbackFormContentExample } from './06-feedback-form-content.vr.ap';
import { default as FeedbackCollectorWithCustomValidationExample } from './07-feedback-collector-with-custom-validation';

export const FeedbackForm: WorkbenchExample = wb(FeedbackFormExample);
export const FeedbackCollector: WorkbenchExample = wb(FeedbackCollectorExample);
export const FeedbackButton: WorkbenchExample = wb(FeedbackButtonExample);
export const CustomFeedbackCollector: WorkbenchExample = wb(CustomFeedbackCollectorExample);
export const FeedbackCollectorWithCustomStyles: WorkbenchExample = wb(
	FeedbackCollectorWithCustomStylesExample,
);
export const FeedbackFormContent: WorkbenchExample = wb(FeedbackFormContentExample);
export const FeedbackCollectorWithCustomValidation: WorkbenchExample = wb(
	FeedbackCollectorWithCustomValidationExample,
);
