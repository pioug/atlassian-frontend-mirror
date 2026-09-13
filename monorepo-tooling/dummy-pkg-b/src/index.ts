import pkgA from '@atlaskit/dummy-pkg-a';

// To verify the Push-Model Consumption pipeline works, you can edit the string in the next line,
// commit and release a new version of the package.
export default 'hello, hello!' as const;

export const pkgAContents: 'dummy-pkg-a' = pkgA;
