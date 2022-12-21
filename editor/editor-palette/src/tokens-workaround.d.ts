// This file exists to ensure the @atlaskit/editor-palette package builds when the
// @atlaskit/tokens package has not been built.

// When building @atlaskit/editor-palette -- the resulting types and dist files
// do not contain any reference to the @atlaskit/tokens package -- which makes
// this safe to do.

// note:
// This file is not picked up by vscode/other editors -- as the tsconfig
// at the root of this package explicitly ignores it.
// This file is when building types  -- as the tsconfig under the build
// folder includes it.

declare module '@atlaskit/tokens' {
  function token(...args: string[]): string;
}
