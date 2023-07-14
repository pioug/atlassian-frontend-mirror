import { glob } from 'glob';
import { promises } from 'fs';
const { readFile } = promises;

/** Return products packages filePaths for running codemods from specified dependent package */
export async function findDependentPackagePaths(
  crawlPaths: string[],
  dependencyPackage: string,
) {
  // Get file paths leading to package.jsons
  const searchStrings = crawlPaths.map((crawlPath) => {
    //Replace leading './' due to bug with node-glob not properly ignoring files https://github.com/isaacs/node-glob/issues/309
    return `${crawlPath.replace(/^\.\//, '')}/**/package.json`;
  });

  // Convert array into glob string
  const globString =
    searchStrings.length > 1
      ? `{${searchStrings.join(',')}}`
      : searchStrings[0];

  const packageJsonPaths = glob.sync(globString, {
    ignore: '**/node_modules/**',
    nodir: true,
  });

  let productPackageJsonPathPromises = packageJsonPaths.map(
    async (filePath) => {
      const fileContents = readFile(filePath, 'utf8');
      // Grep for installedPackage
      const isMatch = (await fileContents)
        .toString()
        .split(/\n/)
        .some(function (line) {
          return line.match(dependencyPackage);
        });
      return isMatch && filePath;
    },
  );

  const productPackageJsonPaths: string[] = (
    await Promise.all(productPackageJsonPathPromises)
  ).filter((path) => path !== false) as string[];

  // Get directory
  const productPackagePaths = productPackageJsonPaths.map((line) =>
    line.replace('/package.json', ''),
  );
  return productPackagePaths;
}
