import { exec } from 'child_process';

import { validateSchemaCompatibility } from 'json-schema-diff-validator';

import { fullSchema as newSchema } from '@atlaskit/adf-schema/json-schema';

// TODO: remove this when jest unit tests are supported for TS files
declare var expect: any;

const RED_START = '\u001b[31m';
const RED_END = '\u001b[39m';
const BOLD_START = '\u001b[1m';
const BOLD_END = '\u001b[22m';
const IMPORTANT_MESSAGE_START = `${RED_START}${BOLD_START}`;
const IMPORTANT_MESSAGE_END = `${BOLD_END}${RED_END}`;

function fetchLastPublishedJSONSchema(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      // Use relative path because the packages folder is not at the root
      // if the test is run in FFE shadow builds.
      `git show origin/master:./packages/editor/adf-schema/json-schema/v1/full.json`,
      { maxBuffer: 512000 },
      (error, stdout, stderr) => {
        if (error || stderr) {
          reject(error || stderr);
        }
        resolve(JSON.parse(stdout));
      },
    );
  });
}

expect.extend({
  toBeBackwardsCompatibleWith(
    received: any,
    argument: any,
    definitionsToSkip: string[] = [],
  ) {
    try {
      definitionsToSkip.forEach(definition => {
        received.definitions[definition] = argument.definitions[definition];
      });

      validateSchemaCompatibility(argument, received, {
        allowNewOneOf: true,
        allowNewEnumValue: true,
        allowReorder: true,
      });

      return {
        pass: true,
      };
    } catch (ex: any) {
      return {
        message: () => ex.message,
        pass: false,
      };
    }
  },
});

// going to be removed as part of https://product-fabric.atlassian.net/browse/ADFEXP-539
describe('bypass empty test suite', () => {
  it('should bypass empty test suite', () => {
    expect(true).toBe(true);
  });
});
describe.skip('JSON schema', () => {
  it('should be backwards compatible', async () => {
    const existingSchema = await fetchLastPublishedJSONSchema();
    try {
      const definitionsToSkip = [''];
      expect(newSchema).toBeBackwardsCompatibleWith(
        existingSchema,
        definitionsToSkip,
      );
    } catch (ex: any) {
      throw new Error(
        'JSON schema backwards compatibility test failed. ' +
          `${IMPORTANT_MESSAGE_START}Have you tried rebasing your current branch against target branch?${IMPORTANT_MESSAGE_END}\n` +
          ex.message,
      );
    }
  });
});
