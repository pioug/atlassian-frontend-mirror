const BRACKET_MAP = {
  '{': '}',
  '[': ']',
  '(': ')',
};

export type BracketMapKeys = Array<keyof typeof BRACKET_MAP>;

export const getAutoClosingBracketInfo = (before: string, after: string) => {
  const left = (Object.keys(BRACKET_MAP) as BracketMapKeys).find(item =>
    before.endsWith(item),
  );
  const right = left ? (BRACKET_MAP[left] as string) : undefined;
  const hasTrailingMatchingBracket = right ? after.startsWith(right) : false;
  return { left, right, hasTrailingMatchingBracket };
};

export const isCursorBeforeClosingBracket = (after: string) => {
  return (Object.keys(BRACKET_MAP) as BracketMapKeys).some(leftBracket =>
    after.startsWith(BRACKET_MAP[leftBracket]),
  );
};

export const isClosingBracket = (text: string) => {
  return (Object.keys(BRACKET_MAP) as BracketMapKeys).some(
    leftBracket => text === BRACKET_MAP[leftBracket],
  );
};
