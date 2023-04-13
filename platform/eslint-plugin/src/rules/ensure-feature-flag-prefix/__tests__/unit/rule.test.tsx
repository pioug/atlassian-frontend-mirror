import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';
import { PackageJson } from 'read-pkg-up';

let mockPath = 'test/package.json';

let mockPackageJson: PackageJson = {
  'platform-feature-flags': {
    'test-flag': {
      type: 'boolean',
    },
  },
};
jest.mock('read-pkg-up', () => ({
  sync: () => ({
    path: mockPath,
    packageJson: mockPackageJson,
  }),
}));

describe('with flag with invalid prefix', () => {
  beforeEach(() => {
    mockPath = 'test/package.json';

    mockPackageJson = {
      'platform-feature-flags': {
        'no-prefix-flag': {
          type: 'boolean',
        },
      },
    };
  });

  // this isolates the invalid case so we can test the suggestion properly
  tester.run('ensure-feature-flag-registration', rule, {
    valid: [],
    invalid: [
      {
        options: [{ allowedPrefixes: ['prefix'] }],
        code: `ffTest('no-prefix-flag')`,
        errors: [
          {
            messageId: 'featureFlagIncorrectPrefix',
            data: {
              featureFlag: 'no-prefix-flag',
              allowedPrefixes: 'prefix',
            },
          },
        ],
      },
    ],
  });
});
