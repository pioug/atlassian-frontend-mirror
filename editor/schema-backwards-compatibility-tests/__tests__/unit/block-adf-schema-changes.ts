import { exec } from 'child_process';

const RED_START = '\u001b[31m';
const RED_END = '\u001b[39m';
const BOLD_START = '\u001b[1m';
const BOLD_END = '\u001b[22m';
const IMPORTANT_MESSAGE_START = `${RED_START}${BOLD_START}`;
const IMPORTANT_MESSAGE_END = `${BOLD_END}${RED_END}`;

function getDiff(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      // Use relative path because the packages folder is not at the root
      // if the test is run in FFE shadow builds.
      `git diff origin/master --name-only`,
      { maxBuffer: 512000 },
      (error, stdout, stderr) => {
        if (error || stderr) {
          reject(error || stderr);
        }
        resolve(stdout);
      },
    );
  });
}

expect.extend({
  notToMatchWithMessage(
    received: string,
    argument: RegExp,
    customMessage: string,
  ) {
    const pass = !received.match(argument);
    if (pass) {
      return {
        message: () => `expected ${received} not to match ${argument}`,
        pass: true,
      };
    } else {
      return {
        message: () => customMessage,
        pass: false,
      };
    }
  },
});

describe('Block build when there are changes to ADF Schema', () => {
  it('should fail when there are changes to ADF Schema', async () => {
    const diff = await getDiff();
    expect(diff).notToMatchWithMessage(
      /packages\/editor\/adf\-schema/,
      `${IMPORTANT_MESSAGE_START}WARNING: ADF Schema has been moved to: https://bitbucket.org/atlassian/adf-schema/src/main/ and will shortly be deleted from Atlassian Frontend. If any changes need to be made to ADF Schema, please do so in the new repository.${IMPORTANT_MESSAGE_END}`,
    );
  });
});
