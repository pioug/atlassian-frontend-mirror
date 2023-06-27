// https://github.com/date-fns/date-fns-upgrade/blob/master/src/v2/convertTokens/index.ts
type TokensMap = {
  [v1token: string]: string;
};

const tokensMap: TokensMap = {
  // 'D MMMM': '',
  // 'Do MMMM': '',
  // 'DD MMMM': '',
  M: 'L',
  Mo: 'Mo',
  MM: 'LL',
  MMM: 'LLL',
  MMMM: 'LLLL',
  Q: 'q',
  Qo: 'qo',
  D: 'd',
  Do: 'do',
  DD: 'dd',
  DDD: 'D',
  DDDo: 'Do',
  DDDD: 'DDD',
  d: 'i',
  do: 'io',
  dd: 'iiiiii',
  ddd: 'iii',
  dddd: 'iiii',
  A: 'a',
  a: 'a',
  aa: 'aaaa',
  E: 'i',
  W: 'I',
  Wo: 'Io',
  WW: 'II',
  YY: 'yy',
  YYYY: 'yyyy',
  GG: 'RR',
  GGGG: 'RRRR',
  H: 'H',
  HH: 'HH',
  h: 'h',
  hh: 'hh',
  m: 'm',
  mm: 'mm',
  s: 's',
  ss: 'ss',
  S: 'S',
  SS: 'SS',
  SSS: 'SSS',
  Z: 'xxx',
  ZZ: 'xx',
  X: 't',
  x: 'T',
} as const;

const v1tokens = Object.keys(tokensMap).sort().reverse();

const tokensRegExp = new RegExp(
  // v1 escape string (unsure the purpose of post-pipe capture group)
  '(\\[[^\\[]*\\])|(\\\\)?' +
    // v2 escape string
    "((?<=').+(?=')|" +
    // All v1 tokens
    v1tokens.join('|') +
    '|.)',
  'g',
);

type TokensBuffer = {
  formatBuffer: string[];
  escapedTextBuffer: string[];
};

export function convertTokens(format: string): string {
  const tokensCaptures = format.match(tokensRegExp);
  if (!tokensCaptures) {
    return format;
  }

  return tokensCaptures
    .reduce(
      (parsed, tokenString, index) => {
        const v2token = tokensMap[tokenString];

        if (!v2token) {
          const escapedCaptures = tokenString.match(/^\[(.+)\]$/);
          if (escapedCaptures) {
            parsed.escapedTextBuffer.push(escapedCaptures[1]);
          } else {
            parsed.escapedTextBuffer.push(tokenString);
          }
        }

        const endOfString = index === tokensCaptures.length - 1;
        if (parsed.escapedTextBuffer.length && (v2token || endOfString)) {
          // This allows double parentheses to be rendered correctly
          // according to date-fns's spec.
          // https://date-fns.org/v2.29.3/docs/format
          const filteredEscapedTextBuffer = parsed.escapedTextBuffer
            .filter((token) => token !== "'")
            .join('');
          parsed.formatBuffer.push(`'${filteredEscapedTextBuffer}'`);
          parsed.escapedTextBuffer = [];
        }

        if (v2token) {
          parsed.formatBuffer.push(v2token);
        }

        return parsed;
      },
      { formatBuffer: [], escapedTextBuffer: [] } as TokensBuffer,
    )
    .formatBuffer.join('');
}
