import { type MessageFormatElement } from 'react-intl';

export type I18NMessages = Record<string, string> | Record<string, MessageFormatElement[]>;
