import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  feedbackTitle: {
    id: 'feedback-collector.feedback-title',
    defaultMessage: 'Share your thoughts',
    description:
      'The title shown at the top of the feedback form encouraging users to leave feedback',
  },
  enrolInResearchLabel: {
    id: 'feedback-collector.enrol-in-research.label',
    defaultMessage: "I'd like to participate in product research",
    description:
      'The checkbox label letting users enrol themselves in future product research interviews',
  },
  canBeContactedLabel: {
    id: 'feedback-collector.can-be-contacted.label',
    defaultMessage:
      'Yes, Atlassian teams can contact me to learn about my experiences to improve Atlassian products and services. I acknowledge the <a>Atlassian Privacy Policy</a>.',
    description:
      'The checkbox label to give consent to be contacted about their feedback',
  },
  summaryPlaceholder: {
    id: 'feedback-collector.summary-placeholder',
    defaultMessage: "Let us know what's on your mind",
    description:
      'The textarea label listing feedback categories (bug, suggestions, questions, comments)',
  },
  formCommentLabel: {
    id: 'feedback-collector.form.comment.label',
    defaultMessage: "Let us know what's on your mind",
    description: 'The textarea label where users can write their comment',
  },
  submitButtonLabel: {
    id: 'feedback-collector.submit-button.label',
    defaultMessage: 'Send feedback',
    description: 'The button to submit the feedback form',
  },
  cancelButtonLabel: {
    id: 'feedback-collector.cancel-button.label',
    defaultMessage: 'Cancel',
    description: 'The button to cancel feedback submission',
  },
  giveFeedback: {
    id: 'proforma-form-builder.give-feedback',
    defaultMessage: 'Give feedback',
    description: 'The button that allows users to give feedback',
  },
  formBugLabel: {
    id: 'feedback-collector.form.bug.label',
    defaultMessage: 'Describe the bug or issue',
    description:
      'The textarea label where users can describe the bug or issue they have',
  },
  formSuggestionLabel: {
    id: 'feedback-collector.form.suggestion.label',
    defaultMessage: "Let us know what you'd like to improve",
    description: 'The textarea label where users can write their suggestion',
  },
  formQuestionLabel: {
    id: 'feedback-collector.form.question.label',
    defaultMessage: 'What would you like to know?',
    description: 'The textarea label where users can write their question',
  },
  formEmptyLabel: {
    id: 'feedback-collector.form.empty.label',
    defaultMessage: 'Select an option',
    description: 'The default dropdown list option',
  },
  selectionOptionQuestionLabel: {
    id: 'feedback-collector.option.question.label',
    defaultMessage: 'Ask a question',
    description: 'The feedback dropdown list option to ask a question',
  },
  selectionOptionCommentLabel: {
    id: 'feedback-collector.option.comment.label',
    defaultMessage: 'Leave a comment',
    description: 'The feedback dropdown list option to leave a comment',
  },
  selectionOptionBugLabel: {
    id: 'feedback-collector.option.bug.label',
    defaultMessage: 'Report a bug',
    description: 'The feedback dropdown list option to report a bug',
  },
  selectionOptionSuggestionLabel: {
    id: 'feedback-collector.option.suggestion.label',
    defaultMessage: 'Suggest an improvement',
    description: 'The feedback dropdown list option to suggest an improvement',
  },
  selectionOptionDefaultLabel: {
    id: 'feedback-collector.option.default.label',
    defaultMessage: 'I want to...',
    description: 'The feedback dropdown list placeholder title',
  },
  feedbackIconLabel: {
    id: 'proforma-form-builder.feedback-icon-label',
    defaultMessage: 'Feedback',
    description: 'Accessibility text used for the feedback icon',
  },
  feedbackSuccessFlagDescription: {
    id: 'feedback-collector.success-flag.description',
    defaultMessage:
      'Your valuable feedback helps us continually improve our products.',
    description: 'Description shown when feedback is successfully submitted',
  },
  feedbackSuccessFlagTitle: {
    id: 'feedback-collector.success-flag.title',
    defaultMessage: 'Thanks!',
    description: 'Button to dismiss successflag flag after submitting feedback',
  },
});
