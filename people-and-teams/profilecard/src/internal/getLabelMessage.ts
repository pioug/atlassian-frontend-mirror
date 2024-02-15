import { defineMessages, MessageDescriptor } from 'react-intl-next';

const getLabelMessage = (
  ariaLabelProp: string | undefined,
  fullName: string | undefined,
  formatMessage: (
    message: MessageDescriptor,
    values?: Record<string, string>,
  ) => string,
): string => {
  if (ariaLabelProp) {
    return ariaLabelProp;
  }

  return fullName
    ? formatMessage(messages.label, { fullName })
    : formatMessage(messages.fallbackLabel);
};

const messages = defineMessages({
  fallbackLabel: {
    id: 'profilecard.user.trigger.fallback-aria-label',
    defaultMessage: 'More information about this user',
    description: 'Label for profile card trigger when we do not have user name',
  },
  label: {
    id: 'profilecard.user.trigger.aria-label',
    defaultMessage: 'More information about {fullName}',
    description: 'Label for profile card trigger',
  },
});

export default getLabelMessage;
