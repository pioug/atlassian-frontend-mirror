import { TextToken } from './';
import { createDashTokenParser } from './dash-token-creator';

const token: TextToken = {
  type: 'text',
  text: '\u2014', // EM DASH
  length: 3,
};
const fallback: TextToken = {
  ...token,
  text: '---',
};

export const tripleDashSymbol = createDashTokenParser(token, fallback);
