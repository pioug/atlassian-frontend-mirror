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

describe('with existing platform-feature-flags section', () => {
  beforeEach(() => {
    mockPath = 'test/package.json';

    mockPackageJson = {
      'platform-feature-flags': {
        'test-flag': {
          type: 'boolean',
        },
      },
    };
  });

  tester.run('ensure-feature-flag-registration', rule, {
    valid: [
      {
        code: `getBooleanFF('test-flag')`,
      },
    ],
    invalid: [
      {
        code: `getBooleanFF('invalid-flag')`,
        errors: [{ messageId: 'featureFlagMissing' }],
      },
    ],
  });
});

describe('with missing platform-feature-flags section', () => {
  beforeEach(() => {
    // change path to bust cache
    mockPath = 'invalid-pkg/package.json';
    mockPackageJson = {};
  });

  tester.run('ensure-feature-flag-registration', rule, {
    valid: [],
    invalid: [
      {
        filename: 'other-directory/index.ts',
        code: `if(getBooleanFF('test-flag')) { }`,
        errors: [{ messageId: 'registrationSectionMissing' }],
      },
    ],
  });
});
