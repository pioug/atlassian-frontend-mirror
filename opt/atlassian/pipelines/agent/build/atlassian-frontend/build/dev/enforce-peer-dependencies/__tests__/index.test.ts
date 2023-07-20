import path from 'path';
import { main, PeerDependencyError } from '../src/index';
import { getFeature } from '@atlassian/repo-feature-flags';

jest.mock('@atlassian/repo-feature-flags');

const mockGetFeature = getFeature as jest.Mock;

const mockResolver = jest.fn((packageName: string) =>
  path.resolve(__dirname, `../__fixtures__/${packageName}`),
) as any;

function checkPackage(packageName: string) {
  process.env.npm_package_json = path.resolve(
    __dirname,
    `../__fixtures__/${packageName}/package.json`,
  );
}

describe('enforce peer dependencies', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    mockGetFeature.mockResolvedValue(true);
  });

  it('should throw error when having incompatible versions of peer dependencies', async () => {
    checkPackage('package-foo-incompatible-version');
    await expect(main(mockResolver)).rejects.toThrow(PeerDependencyError);
  });

  it('should throw error when any peer dependency is not found', async () => {
    checkPackage('package-foo-not-found');
    await expect(main()).rejects.toThrow(PeerDependencyError);
  });

  it('should pass when all peer dependencies are compatible', async () => {
    checkPackage('package-foo-success');
    await expect(main(mockResolver)).resolves.toBeUndefined();
  });
});
