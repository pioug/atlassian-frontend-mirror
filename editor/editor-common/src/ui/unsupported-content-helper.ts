import { Node as PMNode } from 'prosemirror-model';
import { InjectedIntl } from 'react-intl';

export function getUnsupportedContent(
  message: any,
  prefix: string,
  node?: PMNode,
  intl?: InjectedIntl,
) {
  let defaultLocale = 'en';
  let canTranslateToLocale = true;
  let locale = intl ? intl.locale : defaultLocale;
  let finalMessage = message.defaultMessage;

  if (node && locale.startsWith(defaultLocale)) {
    const { originalValue } = node.attrs;
    if (
      originalValue.text ||
      (originalValue.attrs && originalValue.attrs.text)
    ) {
      finalMessage = originalValue.text
        ? originalValue.text
        : originalValue.attrs.text;
      canTranslateToLocale = false;
    } else if (originalValue.type) {
      finalMessage = `${prefix} ${originalValue.type}`;
      canTranslateToLocale = false;
    }
  }

  if (intl && canTranslateToLocale) {
    return intl.formatMessage(message);
  }

  return finalMessage;
}
