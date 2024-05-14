import { API, FileInfo, Options } from 'jscodeshift';

const applyTransform = require('jscodeshift/dist/testUtils').applyTransform;
import formatSync from '@af/formatting/sync';

type Transformer = (file: FileInfo, jscodeshift: API, options: Options) => void;

type TestArgs = {
  it: string;
  original: string;
  expected: string;
  transformer: Transformer;
  mode?: 'only' | 'skip' | 'standard';
  before?: () => void;
  after?: () => void;
};

const newLines = /\n/g;
const longSpaces: RegExp = /[ ]{2,}/g;

function removeWhitespace(value: string): string {
  // not using `.replaceAll` as it's not needed with `/g`
  // and `.replaceAll` did not work pre-2021 TS compile targets
  return value.replace(newLines, '').replace(longSpaces, '');
}

function format(value: string): string {
  const trimmed = removeWhitespace(value);
  const formatted = formatSync(trimmed, 'typescript');
  return formatted;
}

export function check({
  it: name,
  original,
  expected,
  transformer,
  before = () => {},
  after = () => {},
  mode = 'standard',
}: TestArgs) {
  const run = mode === 'only' ? it.only : mode === 'skip' ? it.skip : it;

  run(name, () => {
    before();
    try {
      const output: string = applyTransform(
        { default: transformer, parser: 'tsx' },
        {},
        { source: original },
      );
      expect(format(output)).toEqual(format(expected));
    } catch (e) {
      // a failed assertion will throw
      after();
      throw e;
    }
    // will only be hit if we don't throw
    after();
  });
}
