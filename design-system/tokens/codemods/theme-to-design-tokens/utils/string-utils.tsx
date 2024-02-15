export const kebabize = (str: string) =>
  str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '-' : '') + $.toLowerCase(),
  );

export function findFirstNonspaceIndexAfter(
  text: string,
  index: number,
): number {
  const rest = text.slice(index + 1);
  const indexInRest = rest.search(/\S/);
  if (indexInRest === -1) {
    return text.length;
  } else {
    return index + 1 + indexInRest;
  }
}

export function splitAtIndex(text: string, index: number): [string, string] {
  return [text.slice(0, index), text.slice(index)];
}
