import path from 'path';
import { main, PeerDependencyError } from '../src/index';

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
  });

  it('should throw error when having incompatible versions of peer dependencies', () => {
    checkPackage('package-foo-incompatible-version');
    expect(() => main(mockResolver)).toThrow(PeerDependencyError);
  });

  it('should throw error when any peer dependency is not found', () => {
    checkPackage('package-foo-not-found');
    expect(() => main()).toThrow(PeerDependencyError);
  });

  it('should pass when all peer dependencies are compatible', () => {
    checkPackage('package-foo-success');
    expect(() => main(mockResolver)).not.toThrow();
  });
});
