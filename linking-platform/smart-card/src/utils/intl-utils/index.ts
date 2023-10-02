import { MessageDescriptor } from 'react-intl-next';
import { MessageKey, messages } from '../../messages';

export const toMessage = (
  defaultMessage: MessageDescriptor,
  key?: MessageKey,
): MessageDescriptor => {
  try {
    if (key !== undefined && key in messages) {
      return messages[key];
    }
    return defaultMessage;
  } catch {
    return defaultMessage;
  }
};
