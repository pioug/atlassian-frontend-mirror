import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

const cwd = process.cwd();

describe('test ensure-critical-dependency-resolutions rule', () => {
  tester.run('ensure-critical-dependency-resolutions', rule, {
    valid: [
      // Root package.json, have all of the correct resolutions
      {
        code: `const foo = {
            "resolutions": {
                "@types/react": "16.14.15",
                "typescript": "4.9.5",
            }
        }`,
        filename: `${cwd}/package.json`,
      },
      // Root package.json, have all of the correct resolutions
      {
        code: `const foo = {
                  "resolutions": {
                      "@types/react": "18.2.28",
                      "typescript": "4.9.5",
                  }
              }`,
        filename: `${cwd}/package.json`,
      },
      // Root package.json, have all of the correct resolutions with ~
      {
        code: `const foo = {
            "resolutions": {
                "@types/react": "~16.14.25",
                "typescript": "~4.9.8",
            }
        }`,
        filename: `${cwd}/package.json`,
      },
      // Individual package's package.json. Have part of correct resolutions
      {
        code: `const foo = {
            "resolutions": {
                "@types/react": "16.14.15",
            }
        }`,
        filename: `${cwd}/package/name/package.json`,
      },
      // Individual package's package.json. Not have relevant package resolutions
      {
        code: `const foo = {
            "resolutions": {
                "@types/abcd": "1.2.3",
            }
        }`,
        filename: `${cwd}/package/name/package.json`,
      },
    ],
    invalid: [
      // Root package.json. One package is correct, the other is missing
      {
        code: `const foo = {
                "resolutions": {
                    "typescript": "~4.9.8",
                }
            }`,
        filename: `${cwd}/package.json`,
        errors: [
          {
            messageId: 'invalidPackageResolution',
          },
        ],
      },
      // Root package.json. Both packages have the wrong version ranges
      {
        code: `const foo = {
            "resolutions": {
                "@types/react": "16.8.25",
                "typescript": "4.5.8",
            }
        }`,
        filename: `${cwd}/package.json`,
        errors: [
          {
            messageId: 'invalidPackageResolution',
          },
        ],
      },
      // Root package.json. One package is correct, the other has wrong version range
      {
        code: `const foo = {
            "resolutions": {
                "@types/react": "~16.14.25",
                "typescript": "~4.5.8",
            }
        }`,
        filename: `${cwd}/package.json`,
        errors: [
          {
            messageId: 'invalidPackageResolution',
          },
        ],
      },
      // Root package.json. One package is correct, the other has ^ in its version
      {
        code: `const foo = {
            "resolutions": {
                "@types/react": "~16.14.25",
                "typescript": "^4.9.5",
            }
        }`,
        filename: `${cwd}/package.json`,
        errors: [
          {
            messageId: 'invalidPackageResolution',
          },
        ],
      },
      // Individual package's package.json. One package is correct, the other is wrong
      {
        code: `const foo = {
            "resolutions": {
                "@types/react": "16.14.15",
                "typescript": "4.5.8",
            }
        }`,
        filename: `${cwd}/packages/packge/directory/package.json`,
        errors: [
          {
            messageId: 'invalidPackageResolution',
          },
        ],
      },
    ],
  });
});
