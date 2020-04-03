import { MarkEncoder } from '..';

export const code: MarkEncoder = (text: string): string => {
  return `{{${text}}}`;
};
