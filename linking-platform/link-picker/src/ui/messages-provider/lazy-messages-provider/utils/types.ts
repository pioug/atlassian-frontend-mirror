import { MessageFormatElement } from 'react-intl-next';

export type I18NMessages =
  | Record<string, string>
  | Record<string, MessageFormatElement[]>;
