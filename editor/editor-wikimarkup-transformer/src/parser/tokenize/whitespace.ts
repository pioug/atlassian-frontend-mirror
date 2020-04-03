export function parseWhitespaceAndNewLine(input: string): number {
  const newlineLength = parseNewlineOnly(input);
  if (newlineLength) {
    return newlineLength;
  }

  const whitespaceLength = parseWhitespaceOnly(input);
  if (whitespaceLength) {
    return whitespaceLength;
  }
  // There is nether whitespace nor newline
  return 0;
}

export function parseWhitespaceOnly(input: string) {
  let index = 0;
  const char = input.charAt(index);
  if (char === '\t' || char === ' ') {
    index++;
  }
  return index;
}

export function parseNewlineOnly(input: string): number {
  let index = 0;
  const char = input.charAt(index);

  if (char === '\r') {
    // CR (Unix)
    index++;
    if (input.charAt(index) === '\n') {
      // CRLF (Windows)
      index++;
    }
  } else if (char === '\n') {
    // LF (MacOS)
    index++;
  }
  return index;
}
