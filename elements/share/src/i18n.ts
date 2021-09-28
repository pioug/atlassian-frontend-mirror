import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  formTitle: {
    id: 'fabric.elements.share.form.title',
    defaultMessage: 'Share',
    description: 'Title for Share form.',
  },
  formSend: {
    id: 'fabric.elements.share.form.send',
    defaultMessage: 'Send',
    description: 'Label for Share form submit button.',
  },
  formSendPublic: {
    id: 'fabric.elements.share.form.public.send',
    defaultMessage: 'Send public link',
    description: 'Label for Share form submit button when link is public.',
  },
  formRetry: {
    id: 'fabric.elements.share.form.retry',
    defaultMessage: 'Retry',
    description: 'Label for Share from retry button.',
  },
  commentPlaceholder: {
    id: 'fabric.elements.share.form.comment.placeholder',
    defaultMessage: 'Add a message',
    description: 'Placeholder for the comment field in Share form.',
  },
  userPickerGenericPlaceholder: {
    id: 'fabric.elements.share.form.user-picker.placeholder.generic',
    defaultMessage: 'Enter name, group, team or email',
    description: 'Generic placeholder for the user picker field in Share form.',
  },
  userPickerGenericPlaceholderJira: {
    id: 'fabric.elements.share.form.user-picker.placeholder.jira',
    defaultMessage: 'Enter name, team or email',
    description:
      'Generic placeholder for the user picker field in Share form. ' +
      'This message is used only for Jira product because Jira does not have Group concept.',
  },
  userPickerExistingUserOnlyPlaceholder: {
    id: 'fabric.elements.share.form.user-picker.placeholder.existingUserOnly',
    defaultMessage: 'Enter name or team',
    description:
      'Existing user only placeholder for the user picker field in Share form.',
  },
  userPickerAddMoreMessage: {
    id: 'fabric.elements.share.form.user-picker.add-more',
    defaultMessage: 'Enter more',
    description:
      'Message to encourage the user to add more items to user picker in Share form.',
  },
  userPickerRequiredMessage: {
    id: 'fabric.elements.share.form.user-picker.validation.required',
    defaultMessage: 'Select at least one user, group, team or email.',
    description:
      'Required error message for the user picker field in Share form.',
  },
  userPickerRequiredMessageJira: {
    id: 'fabric.elements.share.form.user-picker.validation.required.jira',
    defaultMessage: 'Select at least one user, team or email.',
    description:
      'Required error message for the user picker field in Share form. ' +
      'This message is used only for Jira product because Jira does not have Group concept.',
  },
  userPickerExistingUserOnlyNoOptionsMessage: {
    id: 'fabric.elements.share.form.user-picker.no-options.existingUserOnly',
    defaultMessage: `We couldn’t find any results for "{inputValue}".`,
    description:
      'Existing user only no options message displayed when the search for users returns empty.',
  },
  userPickerGenericNoOptionsMessage: {
    id: 'fabric.elements.share.form.user-picker.no-options.generic',
    defaultMessage: `We couldn’t find any results for "{inputValue}". Invite people by using an email address.`,
    description:
      'Generic no options message displayed when the search for users returns empty.',
  },
  shareTriggerButtonIconLabel: {
    id: 'fabric.elements.share.trigger.button.icon.label',
    defaultMessage: 'Share icon',
    description:
      'Default text for aria-label of the share dialog trigger button icon',
  },
  shareTriggerButtonText: {
    id: 'fabric.elements.share.trigger.button.text',
    defaultMessage: 'Share',
    description: 'Default text for the share dialog trigger button',
  },
  shareTriggerButtonTooltipText: {
    id: 'fabric.elements.share.trigger.button.tooltip.text',
    defaultMessage: 'Share',
    description:
      'Default text for tooltip on the icon-only share dialog trigger button',
  },
  inviteTriggerButtonText: {
    id: 'fabric.elements.share.trigger.button.invite.text',
    defaultMessage: 'Invite',
    description: 'Button label for when the sharee action is set to "edit".',
  },
  copyLinkButtonIconLabel: {
    id: 'fabric.elements.share.copylink.button.icon.label',
    defaultMessage: 'Copy link icon',
    description: 'Default text for the aria-label of the copy Link icon',
  },
  copyLinkButtonText: {
    id: 'fabric.elements.share.copylink.button.text',
    defaultMessage: 'Copy link',
    description: 'Default text for the Copy Link button',
  },
  copyPublicLinkButtonText: {
    id: 'fabric.elements.share.copypubliclink.button.text',
    defaultMessage: 'Copy public link',
    description:
      'Default text for the Copy Link button when the link is public',
  },
  copiedToClipboardIconLabel: {
    id: 'fabric.elements.share.copied.to.clipboard.icon.label',
    defaultMessage: 'Copy link success icon',
    description: 'Default text for the aria-label of the copied link icon',
  },
  copiedToClipboardMessage: {
    id: 'fabric.elements.share.copied.to.clipboard.message',
    defaultMessage: 'Link copied to clipboard',
    description: 'Default text for the copied link message',
  },
  infoMessageDefaultConfluence: {
    id: 'fabric.elements.share.form.info.message.no.invite.confluence',
    defaultMessage: 'Recipients will see the name of the page and your message',
    description:
      'Message indicating the recipients of the email share will be able to see the Confluence page title and the included message',
  },
  infoMessageDefaultJira: {
    id: 'fabric.elements.share.form.info.message.no.invite.jira',
    defaultMessage:
      'Recipients will see the name of the issue and your message',
    description:
      'Message indicating the recipients of the email share will be able to see the Jira issue title and the included message',
  },
  shareFailureIconLabel: {
    id: 'fabric.elements.share.failure.icon.label',
    defaultMessage: 'Error icon',
    description:
      'Default text for the aria-label of the share failure error icon in the tooltip',
  },
  shareFailureMessage: {
    id: 'fabric.elements.share.failure.message',
    defaultMessage: 'Unable to share',
    description:
      'Default text for share failure message displayed in the tooltip',
  },
  shareSuccessMessage: {
    id: 'fabric.elements.share.success.message',
    defaultMessage:
      '{object, select,' +
      'blogpost {Blog post shared}' +
      'board {Board shared}' +
      'calendar {Calendar shared}' +
      'draft {Draft shared}' + // this is a placeholder for Invite to edit in Confluence
      'filter {Filter shared}' +
      'issue {Issue shared}' +
      'media {Media shared}' +
      'page {Page shared}' +
      'project {Project shared}' +
      'pullrequest {Pull Request shared}' +
      'question {Question shared}' +
      'report {Report shared}' +
      'repository {Repository shared}' +
      'request {Request shared}' +
      'roadmap {Roadmap shared}' +
      'site {Site shared}' +
      'space {Space shared}' +
      'other {Link Shared}' +
      '}',
    description: 'Default text for share success message displayed in a flag',
  },
  shareToIntegrationButtonText: {
    id: 'fabric.elements.share.to.integration.button',
    defaultMessage: 'Share to {integrationName}',
    description:
      'Text for the button that allows the user to share the currently viewed item through a 3rd party app like Slack',
  },
});
