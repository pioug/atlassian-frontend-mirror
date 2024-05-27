jest.mock('projector-spawn');

jest.mock('enquirer', () => ({
  AutoComplete: jest.fn(),
}));

jest.mock('../transforms', () => ({
  ...jest.requireActual<Object>('../transforms'),
  getTransforms: jest.fn().mockImplementation(() => []),
  hasTransform: jest.fn().mockImplementation(() => false),
}));

jest.mock('../sinceRef');

import spawn from 'projector-spawn';
import path from 'path';
import { AutoComplete } from 'enquirer';

import main from '../main';
import { getTransforms, hasTransform } from '../transforms';
import { ValidationError, NoTransformsExistError, type ParsedPkg } from '../types';
import { getPackagesSinceRef } from '../sinceRef';

const codemods = [
  path.parse('node_modules/@atlaskit/button/codemods/3.0.0-foo.ts'),
  path.parse('node_modules/@atlaskit/button/codemods/4.0.0-bar/index.ts'),
  path.parse('node_modules/@atlaskit/range/codemods/5.0.0-baz.ts'),
  path.parse('node_modules/@atlaskit/range/codemods/6.0.0-quux/index.ts'),
];
const mockPath = 'packages/design-system/button';
const mockFlags = {
  transform: `${codemods[0].dir}/${codemods[0].base}`,
  extensions: 'tsx, ts',
  parser: 'tsx' as const,
  ignorePattern: 'node_modules',
  failOnError: true,
};

describe('main', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(global.console, 'warn').mockImplementation(() => {});
    jest.spyOn(global.console, 'log').mockImplementation(() => {});
    (getTransforms as jest.Mock).mockImplementation(() => codemods);
    (AutoComplete as jest.Mock).mockImplementation((options) => ({
      run: () => Promise.resolve(options.result(options.choices[0])),
    }));
  });

  it('should exit early if file path is not supplied', async () => {
    await expect(main([''], mockFlags)).rejects.toThrow(
      new ValidationError(
        'Please supply a path to the source files you wish to modify',
      ),
    );
  });

  it('should contain a custom option if supplied', async () => {
    (hasTransform as jest.Mock).mockImplementation(() => true);
    // @ts-expect-error
    await main([mockPath], { ...mockFlags, foo: 'bar' });

    expect(AutoComplete).not.toHaveBeenCalled();
    expect(spawn).toHaveBeenLastCalledWith(
      expect.stringContaining('jscodeshift'),
      [
        '--fail-on-error',
        '--foo=bar',
        `--transform=${mockFlags.transform}`,
        `--ignore-pattern=${mockFlags.ignorePattern}`,
        `--parser=${mockFlags.parser}`,
        `--extensions=${mockFlags.extensions}`,
        '--cpus=8',
        mockPath,
      ],
      expect.anything(),
    );
  });

  it('should not prompt for a transform if supplied', async () => {
    (hasTransform as jest.Mock).mockImplementation(() => true);
    await main([mockPath], mockFlags);

    expect(AutoComplete).not.toHaveBeenCalled();
    expect(spawn).toHaveBeenLastCalledWith(
      expect.stringContaining('jscodeshift'),
      [
        '--fail-on-error',
        `--transform=${mockFlags.transform}`,
        `--ignore-pattern=${mockFlags.ignorePattern}`,
        `--parser=${mockFlags.parser}`,
        `--extensions=${mockFlags.extensions}`,
        '--cpus=8',
        mockPath,
      ],
      expect.anything(),
    );
  });

  it('should support multiple file paths', async () => {
    (hasTransform as jest.Mock).mockImplementation(() => true);

    await main([mockPath], mockFlags);

    expect(AutoComplete).not.toHaveBeenCalled();
    expect(spawn).toHaveBeenLastCalledWith(
      expect.stringContaining('jscodeshift'),
      [
        '--fail-on-error',
        `--transform=${mockFlags.transform}`,
        `--ignore-pattern=${mockFlags.ignorePattern}`,
        `--parser=${mockFlags.parser}`,
        `--extensions=${mockFlags.extensions}`,
        '--cpus=8',
        mockPath,
      ],
      expect.anything(),
    );
  });

  it('should prompt for a transform if not supplied', async () => {
    await main([mockPath], {
      extensions: 'tsx, ts',
      parser: 'tsx',
      ignorePattern: 'node_modules',
    });

    expect(spawn).toHaveBeenLastCalledWith(
      expect.stringContaining('jscodeshift'),
      [
        `--transform=${mockFlags.transform}`,
        `--ignore-pattern=${mockFlags.ignorePattern}`,
        `--parser=${mockFlags.parser}`,
        `--extensions=${mockFlags.extensions}`,
        '--cpus=8',
        mockPath,
      ],
      expect.anything(),
    );
  });

  it('should prompt for a transform if supplied preset not found', async () => {
    await main([mockPath], {
      ...mockFlags,
      preset: 'wrong-preset-name',
    });

    expect(global.console.warn).toHaveBeenCalledWith(
      `No preset found for: wrong-preset-name`,
    );

    expect(spawn).toHaveBeenLastCalledWith(
      expect.stringContaining('jscodeshift'),
      [
        '--fail-on-error',
        `--transform=${mockFlags.transform}`,
        `--ignore-pattern=${mockFlags.ignorePattern}`,
        `--parser=${mockFlags.parser}`,
        `--extensions=${mockFlags.extensions}`,
        '--cpus=8',
        mockPath,
      ],
      expect.anything(),
    );
  });

  it('should prompt for a transform if supplied and not found', async () => {
    (hasTransform as jest.Mock).mockImplementation(() => false);

    await main([mockPath], {
      ...mockFlags,
      transform: 'node_modules/@atlaskit/button/src/codemods/not-found.ts',
    });

    expect(global.console.warn).toHaveBeenCalledWith(
      `No available transform found for: node_modules/@atlaskit/button/src/codemods/not-found.ts`,
    );
    expect(spawn).toHaveBeenLastCalledWith(
      expect.stringContaining('jscodeshift'),
      [
        '--fail-on-error',
        `--transform=${mockFlags.transform}`,
        `--ignore-pattern=${mockFlags.ignorePattern}`,
        `--parser=${mockFlags.parser}`,
        `--extensions=${mockFlags.extensions}`,
        '--cpus=8',
        mockPath,
      ],
      expect.anything(),
    );
  });

  it('should run transforms contained in directories', async () => {
    (hasTransform as jest.Mock).mockImplementation(() => true);
    (AutoComplete as jest.Mock).mockImplementation((options) => ({
      run: () => Promise.resolve(options.result(options.choices[1])),
    }));

    await main([mockPath], {
      ...mockFlags,
      transform: undefined,
    });

    expect(spawn).toHaveBeenCalledWith(
      expect.stringContaining('jscodeshift'),
      [
        '--fail-on-error',
        `--transform=${codemods[1].dir}/${codemods[1].base}`,
        `--ignore-pattern=${mockFlags.ignorePattern}`,
        `--parser=${mockFlags.parser}`,
        `--extensions=${mockFlags.extensions}`,
        '--cpus=8',
        mockPath,
      ],
      expect.anything(),
    );
  });

  it('should warn when no transforms are available', async () => {
    (getTransforms as jest.Mock).mockImplementation(() => []);

    await expect(main([mockPath], mockFlags)).rejects.toThrowError(
      new NoTransformsExistError(
        'No codemods available. Please make sure you have the latest version of the packages you are trying to upgrade before running the codemod',
      ),
    );
  });

  describe('Packages flag', () => {
    it('should not prompt for a transform if packages are passed', async () => {
      (hasTransform as jest.Mock).mockImplementation(() => true);

      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
        packages: '@atlaskit/button',
      });

      expect(AutoComplete).not.toHaveBeenCalled();
      expect(spawn).toHaveBeenCalledWith(
        expect.stringContaining('jscodeshift'),
        [
          '--fail-on-error',
          `--transform=${mockFlags.transform}`,
          `--ignore-pattern=${mockFlags.ignorePattern}`,
          `--parser=${mockFlags.parser}`,
          `--extensions=${mockFlags.extensions}`,
          '--cpus=8',
          mockPath,
        ],
        expect.anything(),
      );
    });

    it('should parse packages flag into name/version', async () => {
      const cases: Array<{ flag: string; parsed: ParsedPkg[] }> = [
        {
          flag: '@atlaskit/button',
          parsed: [{ name: '@atlaskit/button', version: null }],
        },
        {
          flag: '@atlaskit/button@4.0.0',
          parsed: [{ name: '@atlaskit/button', version: '4.0.0' }],
        },
        {
          flag: '@atlaskit/button,@atlaskit/range',
          parsed: [
            { name: '@atlaskit/button', version: null },
            { name: '@atlaskit/range', version: null },
          ],
        },
        {
          flag: '@atlaskit/button@4.1.3,@atlaskit/range@5.2.1',
          parsed: [
            { name: '@atlaskit/button', version: '4.1.3' },
            { name: '@atlaskit/range', version: '5.2.1' },
          ],
        },
        {
          flag: '@atlaskit/button@^4.1.2,@atlaskit/range@~5.2.1',
          parsed: [
            { name: '@atlaskit/button', version: '4.1.2' },
            { name: '@atlaskit/range', version: '5.2.1' },
          ],
        },
      ];

      for (const { flag, parsed } of cases) {
        jest.clearAllMocks();
        expect(getTransforms).not.toHaveBeenCalled();
        await main([mockPath], {
          ...mockFlags,
          transform: undefined,
          packages: flag,
        });
        expect(getTransforms).toHaveBeenCalledWith(parsed);
      }
    });

    it('should throw when --packages flag is an invalid format', async () => {
      const invalidFormats = [
        [
          'non-scoped-package',
          'Package names must be fully qualified and begin with "@"',
        ],
        ['@package/foo@with@three_at_symbols'],
        ['@package/foo@invalid-version'],
      ];
      jest.clearAllMocks();

      for (const [format, maybeErrorMsg] of invalidFormats) {
        await expect(
          main([mockPath], {
            ...mockFlags,
            transform: undefined,
            packages: format,
          }),
        ).rejects.toThrowError(maybeErrorMsg || /^Invalid version/);
      }
    });

    it('should throw when detecting invalid package versions using --sinceRef', async () => {
      (getPackagesSinceRef as jest.Mock).mockImplementation(() => [
        {
          name: '@atlaskit/button',
          version:
            'https://s3-ap-southeast-2.amazonaws.com/atlaskit-artefacts/564d4e483122/dists/atlaskit-button-13.4.0.tgz',
        },
      ]);
      await expect(
        main([mockPath], {
          ...mockFlags,
          transform: undefined,
          sinceRef: 'head',
        }),
      ).rejects.toThrowError(
        'Detected invalid previous versions of packages upgraded since "head". Previous versions must be valid semver.\n' +
          'Invalid version "https://s3-ap-southeast-2.amazonaws.com/atlaskit-artefacts/564d4e483122/dists/atlaskit-button-13.4.0.tgz" for package "@atlaskit/button"',
      );
    });

    it('should run all transforms for specified packages when packages flag is passed', async () => {
      const buttonCodemods = [
        path.parse('node_modules/@atlaskit/button/codemods/3.0.0-foo.ts'),
        path.parse('node_modules/@atlaskit/button/codemods/4.0.0-bar/index.ts'),
      ];
      (getTransforms as jest.Mock).mockImplementation(() => buttonCodemods);
      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
        packages: '@atlaskit/button',
      });
      expect(spawn).toHaveBeenCalledTimes(buttonCodemods.length);
      expect(spawn).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('jscodeshift'),
        [
          '--fail-on-error',
          `--transform=${buttonCodemods[0].dir + '/' + buttonCodemods[0].base}`,
          `--ignore-pattern=${mockFlags.ignorePattern}`,
          `--parser=${mockFlags.parser}`,
          `--extensions=${mockFlags.extensions}`,
          '--cpus=8',
          mockPath,
        ],
        expect.anything(),
      );
      expect(spawn).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('jscodeshift'),
        [
          '--fail-on-error',
          `--transform=${buttonCodemods[1].dir + '/' + buttonCodemods[1].base}`,
          `--ignore-pattern=${mockFlags.ignorePattern}`,
          `--parser=${mockFlags.parser}`,
          `--extensions=${mockFlags.extensions}`,
          '--cpus=8',
          mockPath,
        ],
        expect.anything(),
      );
    });

    it('should retrieve all codemods for packages modified since ref when sinceRef flag is passed', async () => {
      (getPackagesSinceRef as jest.Mock).mockImplementation(() => [
        {
          name: '@atlaskit/button',
          version: '^1.2.3',
        },
        { name: '@atlaskit/range', version: '^2.3.4' },
      ]);
      expect(getTransforms).not.toHaveBeenCalled();
      expect(getPackagesSinceRef).not.toHaveBeenCalled();
      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
        sinceRef: 'head',
      });
      expect(getPackagesSinceRef).toHaveBeenCalledWith('head');
      expect(getTransforms).toHaveBeenCalledWith([
        { name: '@atlaskit/button', version: '1.2.3' },
        { name: '@atlaskit/range', version: '2.3.4' },
      ]);
    });

    it('should run all codemods for packages modified since ref when sinceRef flag is passed', async () => {
      const buttonCodemods = [
        path.parse('node_modules/@atlaskit/button/codemods/3.0.0-foo.ts'),
        path.parse('node_modules/@atlaskit/button/codemods/4.0.0-bar/index.ts'),
      ];
      (getTransforms as jest.Mock).mockImplementation(() => buttonCodemods);
      (getPackagesSinceRef as jest.Mock).mockImplementation(() => [
        {
          name: '@atlaskit/button',
          version: '^1.2.3',
        },
        { name: '@atlaskit/range', version: '^2.3.4' },
      ]);
      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
        sinceRef: 'head',
      });
      expect(spawn).toHaveBeenCalledTimes(buttonCodemods.length);
      expect(spawn).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('jscodeshift'),
        [
          '--fail-on-error',
          `--transform=${buttonCodemods[0].dir + '/' + buttonCodemods[0].base}`,
          `--ignore-pattern=${mockFlags.ignorePattern}`,
          `--parser=${mockFlags.parser}`,
          `--extensions=${mockFlags.extensions}`,
          '--cpus=8',
          mockPath,
        ],
        expect.anything(),
      );
      expect(spawn).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('jscodeshift'),
        [
          '--fail-on-error',
          `--transform=${buttonCodemods[1].dir + '/' + buttonCodemods[1].base}`,
          `--ignore-pattern=${mockFlags.ignorePattern}`,
          `--parser=${mockFlags.parser}`,
          `--extensions=${mockFlags.extensions}`,
          '--cpus=8',
          mockPath,
        ],
        expect.anything(),
      );
    });
  });

  describe('Prompt rendering', () => {
    it('should render prompt with preset', async () => {
      const transformPath = path.parse(
        '/atlassian-frontend/packages/monorepo-tooling/codemod-cli/src/presets/styled-to-emotion.ts',
      );
      let choices: string[] = [];
      let result: string = '';

      (getTransforms as jest.Mock).mockImplementation(() => [transformPath]);
      (
        AutoComplete as jest.Mock<
          any,
          [{ result: Function; choices: string[] }]
        >
      ).mockImplementation((options) => ({
        run: () => {
          result = options.result(options.choices[0]);
          choices = [...choices, ...options.choices];
          return Promise.resolve(options.result(options.choices[0]));
        },
      }));

      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
      });

      expect(choices).toEqual(['@atlaskit/codemod-cli: styled-to-emotion']);
      expect(result).toEqual(expect.objectContaining(transformPath));
    });

    it('should render prompt with preset enclosed in dedicated folder', async () => {
      const transformPath = path.parse(
        '/atlassian-frontend/packages/monorepo-tooling/codemod-cli/src/presets/styled-to-emotion/index.ts',
      );
      let choices: string[] = [];
      let result: string = '';

      (getTransforms as jest.Mock).mockImplementation(() => [transformPath]);
      (
        AutoComplete as jest.Mock<
          any,
          [{ result: Function; choices: string[] }]
        >
      ).mockImplementation((options) => ({
        run: () => {
          result = options.result(options.choices[0]);
          choices = [...choices, ...options.choices];
          return Promise.resolve(options.result(options.choices[0]));
        },
      }));

      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
      });

      expect(choices).toEqual(['@atlaskit/codemod-cli: styled-to-emotion']);
      expect(result).toEqual(expect.objectContaining(transformPath));
    });

    it('should render prompt with preset enclosed in dedicated folder and same name', async () => {
      const transformPath = path.parse(
        '/atlassian-frontend/packages/monorepo-tooling/codemod-cli/src/presets/styled-to-emotion/styled-to-emotion.ts',
      );
      let choices: string[] = [];
      let result: string = '';

      (getTransforms as jest.Mock).mockImplementation(() => [transformPath]);
      (
        AutoComplete as jest.Mock<
          any,
          [{ result: Function; choices: string[] }]
        >
      ).mockImplementation((options) => ({
        run: () => {
          result = options.result(options.choices[0]);
          choices = [...choices, ...options.choices];
          return Promise.resolve(options.result(options.choices[0]));
        },
      }));

      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
      });

      expect(choices).toEqual(['@atlaskit/codemod-cli: styled-to-emotion']);
      expect(result).toEqual(expect.objectContaining(transformPath));
    });

    it('should render prompt with bundled preset', async () => {
      const transformPath = path.parse(
        '/atlassian-frontend/packages/monorepo-tooling/codemod-cli/dist/cjs/presets/styled-to-emotion.ts',
      );
      let choices: string[] = [];
      let result: string = '';

      (getTransforms as jest.Mock).mockImplementation(() => [transformPath]);
      (
        AutoComplete as jest.Mock<
          any,
          [{ result: Function; choices: string[] }]
        >
      ).mockImplementation((options) => ({
        run: () => {
          result = options.result(options.choices[0]);
          choices = [...choices, ...options.choices];
          return Promise.resolve(options.result(options.choices[0]));
        },
      }));

      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
      });

      expect(choices).toEqual(['@atlaskit/codemod-cli: styled-to-emotion']);
      expect(result).toEqual(expect.objectContaining(transformPath));
    });

    it('should render prompt with bundled preset enclosed in dedicated folder', async () => {
      const transformPath = path.parse(
        '/atlassian-frontend/packages/monorepo-tooling/codemod-cli/dist/cjs/presets/styled-to-emotion/index.ts',
      );
      let choices: string[] = [];
      let result: string = '';

      (getTransforms as jest.Mock).mockImplementation(() => [transformPath]);
      (
        AutoComplete as jest.Mock<
          any,
          [{ result: Function; choices: string[] }]
        >
      ).mockImplementation((options) => ({
        run: () => {
          result = options.result(options.choices[0]);
          choices = [...choices, ...options.choices];
          return Promise.resolve(options.result(options.choices[0]));
        },
      }));

      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
      });

      expect(choices).toEqual(['@atlaskit/codemod-cli: styled-to-emotion']);
      expect(result).toEqual(expect.objectContaining(transformPath));
    });

    it('should render prompt with bundled preset enclosed in dedicated folder and same name', async () => {
      const transformPath = path.parse(
        '/atlassian-frontend/packages/monorepo-tooling/codemod-cli/dist/cjs/presets/styled-to-emotion/styled-to-emotion.ts',
      );
      let choices: string[] = [];
      let result: string = '';

      (getTransforms as jest.Mock).mockImplementation(() => [transformPath]);
      (
        AutoComplete as jest.Mock<
          any,
          [{ result: Function; choices: string[] }]
        >
      ).mockImplementation((options) => ({
        run: () => {
          result = options.result(options.choices[0]);
          choices = [...choices, ...options.choices];
          return Promise.resolve(options.result(options.choices[0]));
        },
      }));

      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
      });

      expect(choices).toEqual(['@atlaskit/codemod-cli: styled-to-emotion']);
      expect(result).toEqual(expect.objectContaining(transformPath));
    });

    it('should render prompt with module transform', async () => {
      const transformPath = path.parse(
        'node_modules/@atlaskit/button/src/codemods/foo.ts',
      );
      let choices: string[] = [];
      let result: string = '';

      (getTransforms as jest.Mock).mockImplementation(() => [transformPath]);
      (
        AutoComplete as jest.Mock<
          any,
          [{ result: Function; choices: string[] }]
        >
      ).mockImplementation((options) => ({
        run: () => {
          result = options.result(options.choices[0]);
          choices = [...choices, ...options.choices];
          return Promise.resolve(options.result(options.choices[0]));
        },
      }));

      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
      });

      expect(choices).toEqual(['@atlaskit/button: foo']);
      expect(result).toEqual(expect.objectContaining(transformPath));
    });

    it('should render prompt with module transform enclosed in dedicated folder', async () => {
      const transformPath = path.parse(
        'node_modules/@atlaskit/button/src/codemods/foo/index.ts',
      );
      let choices: string[] = [];
      let result: string = '';

      (getTransforms as jest.Mock).mockImplementation(() => [transformPath]);
      (
        AutoComplete as jest.Mock<
          any,
          [{ result: Function; choices: string[] }]
        >
      ).mockImplementation((options) => ({
        run: () => {
          result = options.result(options.choices[0]);
          choices = [...choices, ...options.choices];
          return Promise.resolve(options.result(options.choices[0]));
        },
      }));

      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
      });

      expect(choices).toEqual(['@atlaskit/button: foo']);
      expect(result).toEqual(expect.objectContaining(transformPath));
    });

    it('should render prompt with as file path if transform type is unknown', async () => {
      const transformPath = path.parse(
        'node_modules/unknown/button/src/codemods/foo/index.ts',
      );
      let choices: string[] = [];
      let result: string = '';

      (getTransforms as jest.Mock).mockImplementation(() => [transformPath]);
      (
        AutoComplete as jest.Mock<
          any,
          [{ result: Function; choices: string[] }]
        >
      ).mockImplementation((options) => ({
        run: () => {
          result = options.result(options.choices[0]);
          choices = [...choices, ...options.choices];
          return Promise.resolve(options.result(options.choices[0]));
        },
      }));

      await main([mockPath], {
        ...mockFlags,
        transform: undefined,
      });

      expect(choices).toEqual([
        'node_modules/unknown/button/src/codemods/foo/index',
      ]);
      expect(result).toEqual(expect.objectContaining(transformPath));
    });
  });
});
