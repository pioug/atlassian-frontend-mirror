import { defineMessages } from 'react-intl-next';

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
  formShare: {
    id: 'fabric.elements.share.form.share',
    defaultMessage: 'Share',
    description: 'Label for Share form submit button.',
  },
  formSendPublic: {
    id: 'fabric.elements.share.form.public.send',
    defaultMessage: 'Send public link',
    description: 'Label for Share form submit button when link is public.',
  },
  formSharePublic: {
    id: 'fabric.elements.share.form.public.share',
    defaultMessage: 'Share public link',
    description: 'Label for Share form submit button when link is public.',
  },
  formRetry: {
    id: 'fabric.elements.share.form.retry',
    defaultMessage: 'Retry',
    description: 'Label for Share from retry button.',
  },
  formNoPermissions: {
    id: 'fabric.elements.share.form.no-permissions',
    defaultMessage: 'You do not have the ability to share.',
    description: 'Copy to show when a user can not share.',
  },
  commentLabel: {
    id: 'fabric.elements.share.form.comment.label',
    defaultMessage: 'Message (optional)',
    description: 'Label for the comment field in the Share form.',
  },
  commentPlaceholder: {
    id: 'fabric.elements.share.form.comment.placeholder',
    defaultMessage: 'Anything they should know?',
    description: 'Placeholder for the comment field in Share form.',
  },
  // Email disabled (Jira)
  userPickerLabelEmailDisabledJira: {
    id: 'fabric.elements.share.form.user-picker.label.email-disabled-jira',
    defaultMessage: 'Names or teams',
    description:
      'Label for the user picker field in the Share form in Jira with no email option.',
  },
  userPickerPlaceholderEmailDisabledJira: {
    id: 'fabric.elements.share.form.user-picker.placeholder.email-disabled-jira',
    defaultMessage: 'e.g. Maria, Team Orange',
    description:
      'Placeholder for the user picker field in the Share form in Jira with no email option. These examples should be localized.',
  },
  userPickerRequiredMessageEmailDisabledJira: {
    id: 'fabric.elements.share.form.user-picker.validation.required-message.email-disabled-jira',
    defaultMessage: 'Select at least one person or team',
    description:
      'Error message for the user picker field in the Share form in Jira with no email option, when no entries are selected.',
  },
  // Email disabled (Confluence)
  userPickerLabelEmailDisabledConfluence: {
    id: 'fabric.elements.share.form.user-picker.label.email-disabled-confluence',
    defaultMessage: 'Names, teams, or groups',
    description:
      'Label for the user picker field in the Share form in Confluence with no email option.',
  },
  userPickerRequiredMessageEmailDisabledConfluence: {
    id: 'fabric.elements.share.form.user-picker.validation.required-message.email-disabled-confluence',
    defaultMessage: 'Select at least one person, team, or group',
    description:
      'Error message for the user picker field in the Share form in Confluence with no email option, when no entries are selected.',
  },
  // Browse users disabled
  userPickerLabelBrowseUsersDisabled: {
    id: 'fabric.elements.share.form.user-picker.label.email-only',
    defaultMessage: 'Emails',
    description:
      'Label for the user picker field in the Share form when browse user permissions are disabled.',
  },
  userPickerPlaceholderBrowseUsersDisabled: {
    id: 'fabric.elements.share.form.user-picker.placeholder.email-only',
    defaultMessage: 'e.g. maria@company.com',
    description:
      'Placeholder for the user picker field in the Share form when browse user permissions are disabled. These examples should be localized.',
  },
  userPickerRequiredMessageBrowseUsersDisabled: {
    id: 'fabric.elements.share.form.user-picker.validation.required-message.email-only',
    defaultMessage: 'Select at least one email',
    description:
      'Error message for the user picker field in the Share form in when browse user permissions are disabled, when no entries are selected.',
  },
  // Generic (Jira)
  userPickerLabelJira: {
    id: 'fabric.elements.share.form.user-picker.label.jira',
    defaultMessage: 'Names, teams, or emails',
    description: 'Label for the user picker field in the Share form in Jira.',
  },
  userPickerPlaceholderJira: {
    id: 'fabric.elements.share.form.user-picker.placeholder.jira',
    defaultMessage: 'e.g. Maria, Team Orange, maria@company.com',
    description:
      'Placeholder for the user picker field in the Share form in Jira. These examples should be localized.',
  },
  userPickerRequiredMessageJira: {
    id: 'fabric.elements.share.form.user-picker.validation.required-message.jira',
    defaultMessage: 'Select at least one person, team, or email',
    description:
      'Error message for the user picker field in the Share form in Jira, when no entries are selected.',
  },
  // Generic (Confluence)
  userPickerLabelConfluence: {
    id: 'fabric.elements.share.form.user-picker.label.confluence',
    defaultMessage: 'Names, teams, groups, or emails',
    description:
      'Label for the user picker field in the Share form in Confluence.',
  },
  userPickerPlaceholderConfluence: {
    id: 'fabric.elements.share.form.user-picker.placeholder.confluence',
    defaultMessage: 'e.g. Maria, Team Orange, group-one',
    description:
      'Placeholder for the user picker field in the Share form in Confluence. These examples should be localized.',
  },
  userPickerRequiredMessageConfluence: {
    id: 'fabric.elements.share.form.user-picker.validation.required-message.confluence',
    defaultMessage: 'Select at least one person, team, group, or email',
    description:
      'Error message for the user picker field in the Share form in Confluence, when no entries are selected.',
  },
  // Common messages
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
      'summary {Summary shared}' +
      'list {List shared}' +
      'timeline {Timeline shared}' +
      'form {Form shared}' +
      'media {Media shared}' +
      'page {Page shared}' +
      'project {Project shared}' +
      'pullrequest {Pull Request shared}' +
      'question {Question shared}' +
      'report {Report shared}' +
      'repository {Repository shared}' +
      'request {Request shared}' +
      'roadmap {Timeline shared}' +
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
  shareInIntegrationButtonText: {
    id: 'fabric.elements.share.in.integration.button',
    defaultMessage: 'Share in {integrationName}',
    description:
      'Text for the button that allows the user to share the currently viewed item through a 3rd party app like Slack',
  },
  shareMainTabTextJira: {
    id: 'fabric.elements.share.main.tab.text.jira',
    defaultMessage: 'Share issue',
    description: 'Text for the main share tab for jira',
  },
  shareMainTabTextConfluence: {
    id: 'fabric.elements.share.main.tab.text.confluence',
    defaultMessage: 'Share page',
    description: 'Text for the main share tab for confluence',
  },
});
