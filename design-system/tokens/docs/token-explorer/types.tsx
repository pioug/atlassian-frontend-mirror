import type { TransformedToken } from 'style-dictionary';

import type { PaintToken, RawToken, ShadowToken } from '../../src/types';

export interface TransformedTokenWithAttributes extends TransformedToken {
  attributes:
    | (TransformedToken['attributes'] & PaintToken['attributes'])
    | ShadowToken['attributes']
    | RawToken['attributes'];
}

export interface TransformedTokenMerged extends TransformedTokenWithAttributes {
  nameClean: string;
  darkToken: TransformedTokenWithAttributes;
}

export interface TransformedTokenGrouped extends TransformedTokenMerged {
  extensions?: TransformedTokenGrouped[];
}
