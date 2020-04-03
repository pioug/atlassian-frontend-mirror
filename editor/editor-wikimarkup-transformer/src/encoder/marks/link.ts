import { LinkAttributes } from '@atlaskit/adf-schema';
import { MarkEncoder } from '..';

export const link: MarkEncoder = (
  text: string,
  attrs: LinkAttributes,
): string => {
  return `[${text}|${attrs.href}]`;
};
