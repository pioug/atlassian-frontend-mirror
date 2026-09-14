import { messages } from '../components/i18n';

export const isMessagesKey = (key: string): key is keyof typeof messages => key in messages;
