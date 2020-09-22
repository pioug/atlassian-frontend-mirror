import { API, FileInfo, Options } from 'jscodeshift';

const applyTransform = require('jscodeshift/dist/testUtils').applyTransform;

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

function noop() {}

export function check({
  it: name,
  original,
  expected,
  transformer,
  before = noop,
  after = noop,
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
      expect(output).toBe(expected.trim());
    } catch (e) {
      // a failed assertion will throw
      after();
      throw e;
    }
    // will only be hit if we don't throw
    after();
  });
}
