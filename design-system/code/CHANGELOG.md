# @atlaskit/code

## 14.1.3

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 14.1.2

### Patch Changes

- [`d827fec15b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d827fec15b2) - Fixes a regression in ^14.0.0 that meant the function `getCodeStyles` didn't work correctly with interpolations using the `styled-components` theming.

## 14.1.1

### Patch Changes

- [`cd488f9d370`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd488f9d370) - Bumps prismjs to address a security vulnerability in the underlying lib.

## 14.1.0

### Minor Changes

- [`aef12f51c46`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aef12f51c46) - Add an entry point for constants to expose SUPPORTED_LANGUAGES and export the type of SUPPORTED_LANGUAGES.
  Splunk SPl has also been added as a supported language.

## 14.0.1

### Patch Changes

- [`596f1eb2fca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/596f1eb2fca) - [ux] Line height property remvoved from inline code. This was a bug as the line height was being under calculated relative to the code's font size. It now inherits correctly.
- Updated dependencies

## 14.0.0

### Major Changes

- [`e8f66c36dd7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8f66c36dd7) - **BREAKING CHANGES**

  This version includes several breaking changes to improve performance of the `@atlaskit/code` package.

  `<Code />` no longer supports syntax highlighting, greatly simplifying the component. Additionally, the `text` prop has been removed in favour of using `children` directly. This allows users to provide complex nodes (not just plain text) to Code.

  ```jsx
  // previous
  <Code text="const x = 10;" language="js" />
  // now with language no longer supported
  <Code>const x = 10;</Code>
  ```

  Component theming is no longer supported in `<Code />` or `<CodeBlock />`; this change does not effect global theming. As an escape hatch, two CSS variables are exposed:

  - `--ds--code--line-number-bg-color`: which controls the background color of the line numbers if set
  - `--ds--code--bg-color`: which controls the background color of the block body if set

  Components can now be imported individually using individual entrypoints. Using these entrypoints will reduce the overall bundle size of this package if you do not need both components.

  ```js
  import { Code } from '@atlaskit/code';
  // --> to
  import Code from '@atlaskit/code/inline';

  import { CodeBlock } from '@atlaskit/code';
  // --> to
  import CodeBlock from '@atlaskit/code/block';

  // note this will still work
  import { Code, CodeBlock } from '@atlaskit/code';
  ```

  Finally, `CodeBlock` has had type improvements, and internal optimisations to facilitate faster rendering and updates.

- [`7e091c1d415`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e091c1d415) - BREAKING CHANGE:

  The `codeStyle` prop has now been removed on the `Code` component.

  For reference, previously this type of usage would effect the styling of any numbers in the code text.

  ```js
  <Code codeStyle={{ number: 'red' }} text={someCode} />
  ```

  Due to internal changes the above usage is no longer possible.

  This release also includes internal changes to the syntax highlighting element to use class names instead of inline styles for syntax highlighting. This results in a substantial performance gain.

### Minor Changes

- [`07e012bfc5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07e012bfc5b) - Updates to internal package structure, exposing additional entrypoints. Types also tightened for language support to better match underlying component.

### Patch Changes

- [`b46ca884bc8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b46ca884bc8) - Add a codemod to remove usages of the `language` prop and convert the `text` prop to be a child.
- Updated dependencies

## 13.2.3

### Patch Changes

- [`900819ca759`](https://bitbucket.org/atlassian/atlassian-frontend/commits/900819ca759) - Update to VR test suite, to make diffs easier to reason about.
- Updated dependencies

## 13.2.2

### Patch Changes

- [`c9da1eecd2a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9da1eecd2a) - Internal changes moving class components to functional components, added updated types for react-syntax-highlighter

## 13.2.1

### Patch Changes

- [`413cc46d307`](https://bitbucket.org/atlassian/atlassian-frontend/commits/413cc46d307) - [ux] Added colors for missing syntax keywords

## 13.2.0

### Minor Changes

- [`3c7be954dbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c7be954dbd) - [ux] Line highlighting now meets WCAG 2.1 guidelines. Colors that were failing contrast have been updated and there is now a new visual cue consisting of a left border to the highlighted lines.
- [`23ef692842a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/23ef692842a) - [ux] `Code` and `CodeBlock` now use react-syntax-highlighter@^15 to highlight code. As part of this change
  the fontSize for the line numbers and the code body have been normalised. This will be a breaking visual change for all consumers.
  No action is required other than a callout that this will affect any existing visual regression tests.

  Users can now use the `themeOverride` prop to customise the application of the default theme. This is an escape hatch
  which will likley be removed in a future major version.

  This change also includes:

  - A bugfix for lineHeight that meant linenumbers and code body were not vertically aligned correctly.
  - A bugfix for the SSR'd components not rendering consistently before hydration
  - Improved semantic lines, which can now be properly consumed by screen readers.
  - The `Code` and `CodeBlock` now expose additional options in their `theme` prop. These are `codeFontSize` and `codeLineHeight`
    which allow customisation of the component's rendered font size.

- [`7c2f2056ef7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c2f2056ef7) - [ux] Added code syntax highlighting for the following languages: AppleScript, Clojure, Delphi, Diff, FoxPro, Object Pascal, QML, Standard ML, Visual Basic, JSX and TSX

### Patch Changes

- [`72d19d3f308`](https://bitbucket.org/atlassian/atlassian-frontend/commits/72d19d3f308) - Internal changes relating to types, and tests. Includes a small bugfix to the way Code component had styles applied and adds testId as a prop to both Code and CodeBlock.
- [`84c4d95e2e0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84c4d95e2e0) - [ux] Line numbers now have correct spacing in Firefox and Safari.
- [`a4bcf21a972`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4bcf21a972) - [ux] Syntax highlighting now uses accessibile colors that meet WCAG 2.0 Level AA guidelines for color contrast
- [`b5873e7bf01`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5873e7bf01) - [ux] Fixed highlighted line left border alignment.

## 13.1.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 13.1.0

### Minor Changes

- [`17162a77f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17162a77f2) - types of Supported Languages for @atlaskit/code is maintained by the package itself. Useful for when one references Supported Languages, wanting to know what types of languages are supported by @atlaskit/code.

## 13.0.3

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 13.0.2

### Patch Changes

- Updated dependencies

## 13.0.1

### Patch Changes

- [`ade5203287`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ade5203287) - Fix codemod utilities being exposed through the codemod cli

## 13.0.0

### Major Changes

- [`37f8133702`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37f8133702) - - Rename `AkCode` and `AkCodeBlock` exports to `Code` and `CodeBlock` respectively.
  - Remove unnecessary props (`lineNumberContainerStyle`, `showLineNumbers` and `highlight`) from `Code`.
  - Add codemods for above changes. Codemods can be found inside [codemods](./codemods) directory.
    Please use [@atlaskit/codemod-cli](https://www.npmjs.com/package/@atlaskit/codemod-cli) for running the codemods according to version of your package.
    Check its documentation [here](https://www.npmjs.com/package/@atlaskit/codemod-cli).
  - Split exported `Theme` type into `CodeTheme` and `CodeBlockTheme`.
  - Remove `lineNumberColor` and `lineNumberBgColor` type from `CodeTheme`. They are available only in `CodeBlockTheme` now.

### Patch Changes

- [`336f870e37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/336f870e37) - fix exception errors of syntax highlighter for several languages

## 12.0.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 12.0.2

### Patch Changes

- [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme and package information has been updated to point to the new design system website.

## 12.0.1

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 12.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 11.1.6

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 11.1.5

### Patch Changes

- [patch][f7f2068a76](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7f2068a76):

  Change imports to comply with Atlassian conventions

## 11.1.4

### Patch Changes

- [patch][5f5b93071f](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5b93071f):

  Code highlighting now works as expected when highlighting single to double digit lines.- Updated dependencies [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):

- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/docs@8.5.0

## 11.1.3

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/theme@9.5.1

## 11.1.2

### Patch Changes

- [patch][b52f2be5d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b52f2be5d9):

  ThemedCode and ThemeCodeBlock props are now correctly typed- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):

  - @atlaskit/docs@8.3.0

## 11.1.1

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

  - @atlaskit/theme@9.5.0

## 11.1.0

### Minor Changes

- [minor][9648afc5be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9648afc5be):

  Adds `highlight` prop to `AkCodeBlock`, `Example`, and the `code` template literal.
  Use this to emphasize which lines of code you would like people to look at!

  The `highlight` prop can be used as follows:

  - To highlight one line:
    `highlight="3"`
  - To highlight sequential lines:
    `highlight="1-5"`
  - To highlight sequential and multiple single lines:
    `highlight="1-5,7,10,15-20"`

  **`AkCodeBlock` component**

  Use the `highlight` prop.

  ```js
  import { AkCodeBlock } from '@atlaskit/code';

  <AkCodeBlock
    highlight="1-2"
    text={`
  <div>
    hello there
    <span>buds</span>
  </div>
    `}
  />;
  ```

  **`Example` component**

  Use the `highlight` prop.

  ```js
  import { Example } from '@atlaskit/docs';

  <Example
    packageName="@atlaskit/code"
    Component={require('../examples/00-inline-code-basic').default}
    title="Basic"
    highlight="19,24,30,36"
    source={require('!!raw-loader!../examples/00-inline-code-basic')}
  />;
  ```

  **`code` template literal**

  Add `highlight=` to the top of your code snippet.
  It takes the same values as the `highlight` prop.

  ```js
  import { code } from '@atlaskit/docs';

  code`highlight=5-7
    import React from 'react';
  
    () => (
      <div>
        hello there
        <span>buds</span>
      </div>
  )`;
  ```

## 11.0.14

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 11.0.13

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 11.0.12

### Patch Changes

- [patch][65ada7f318](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65ada7f318):

  **FABDODGEM-12 Editor Cashmere Release**

  - [Internal post](http://go.atlassian.com/cashmere-release)

  **Affected editor components:**

  tables, media, mobile, text color, emoji, copy/paste, analytics

  **Performance**

  - Async import for code blocks and task items on renderer
    - https://product-fabric.atlassian.net/browse/ED-7155

  **Table**

  - Add support to sort tables that contains smart links
    - https://product-fabric.atlassian.net/browse/ED-7449
  - Scale table when changing to full width mode
    - https://product-fabric.atlassian.net/browse/ED-7724

  **Text color**

  - Update text color toolbar with right color when text is inside a list, panel, etc.
    - https://product-fabric.atlassian.net/browse/FM-1752

**Mobile** - Implement undo/redo interface on Hybrid Editor - https://product-fabric.atlassian.net/browse/FM-2393

**Copy and Paste**

    - Support copy & paste when missing context-id attr
      - https://product-fabric.atlassian.net/browse/MS-2344
    - Right click + copy image fails the second time that is pasted
      - https://product-fabric.atlassian.net/browse/MS-2324
    - Copying a never touched image for the first time from editor fails to paste
      - https://product-fabric.atlassian.net/browse/MS-2338
    - Implement analytics when a file is copied
      - https://product-fabric.atlassian.net/browse/MS-2036

**Media**

- Add analytics events and error reporting [NEW BIG FEATURE]
  - https://product-fabric.atlassian.net/browse/MS-2275
  - https://product-fabric.atlassian.net/browse/MS-2329
  - https://product-fabric.atlassian.net/browse/MS-2330
  - https://product-fabric.atlassian.net/browse/MS-2331
  - https://product-fabric.atlassian.net/browse/MS-2332
  - https://product-fabric.atlassian.net/browse/MS-2390
- Fixed issue where we can’t insert same file from MediaPicker twice
  - https://product-fabric.atlassian.net/browse/MS-2080
- Disable upload of external files to media
  - https://product-fabric.atlassian.net/browse/MS-2372

**Notable Bug Fixes**

    - Implement consistent behaviour for rule and mediaSingle on insertion
      - Feature Flag:
        - allowNewInsertionBehaviour - [default: true]
      - https://product-fabric.atlassian.net/browse/ED-7503
    - Fixed bug where we were showing table controls on mobile.
      - https://product-fabric.atlassian.net/browse/ED-7690
    - Fixed bug where editor crashes after unmounting react component.
      - https://product-fabric.atlassian.net/browse/ED-7318
    - Fixed bug where custom emojis are not been showed on the editor
      - https://product-fabric.atlassian.net/browse/ED-7726

- [patch][1715ad2bd5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1715ad2bd5):

  ED-7731: add support for GraphQL syntax highlighting

## 11.0.11

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 11.0.10

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 11.0.9

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 11.0.8

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full typescript support so it is recommended that typescript consumers use it also.

## 11.0.7

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 11.0.6

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 11.0.5

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 11.0.4

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 11.0.3

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 11.0.2

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 11.0.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 11.0.0

- [major][97bfe81ec8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bfe81ec8):

  - @atlaskit/code has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 10.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 9.0.1

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/theme@8.1.7

## 9.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only distribute esm. This means all distributed code will be transpiled, but will still contain `import` and
  `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder, we have to worry about how consumers might be using things that aren't _actually_ supposed to be used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of packages bundling all of theme, just to use a single color, especially in situations where tree shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have multiple distributions as they would need to have very different imports from of their own internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but we see this as a pretty sane path forward which should lead to some major bundle size decreases, saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for external) if you have any questions or queries about this.

## 8.2.3

- [patch][d49e9bbb13](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d49e9bbb13):

  - Expose the props on website

## 8.2.2

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 8.2.1

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/theme@7.0.0

## 8.2.0

- [minor][10fe416](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10fe416):

  - Props Language should be required and surfacing more props for code

## 8.1.1

- [patch][84e8015](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84e8015):

  - Bump react-syntax-highlighter to 10.0.1

## 8.1.0

- [minor][26027dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26027dd):

  - Upgrade react syntax highlighter to version that ships its own async loaded languages and supports SSR

## 8.0.12

- [patch] Inline code should wrap [f1d9a54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1d9a54)

## 8.0.11

- [patch] Fix webpack 3 support for page & code [03af95e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03af95e)

## 8.0.10

- [patch] Update babel config to transpile out dynamic imports for commonjs [2dae295](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dae295)

## 8.0.9

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 8.0.8

- [patch] Add some padding to the code without line numbers [67cd63d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67cd63d)

## 8.0.7

- [patch] Added yaml to supported languages for code and added styling for the key token. [95f9236](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95f9236)

## 8.0.6

- [patch] Async load highlighter languages [9102fa2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9102fa2)

## 8.0.5

- [patch] Upgrade react-syntax-highlighter again and use async loaded prism [260d66a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/260d66a)

## 8.0.4

- [patch] Upgraded react-syntax-highlighter to 8.0.2 [7cc7000](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cc7000)

## 8.0.3

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 8.0.1

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/docs@5.0.6

## 8.0.0

- [major] ED-4989: replace hjs with prism [f9c0cdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c0cdb)
- [none] Updated dependencies [f9c0cdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c0cdb)
  - @atlaskit/docs@5.0.5

## 7.0.3

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/theme@5.1.3

## 7.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/theme@5.1.2
  - @atlaskit/docs@5.0.2

## 7.0.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/theme@5.1.1

## 7.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0

## 6.0.1

- [patch] Add default theme prop to prevent Code throwing errors when no theme provider is given [07334bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07334bc)
- [none] Updated dependencies [07334bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07334bc)

## 6.0.0

- [major] Significantly reduce the bundle-size of @atlaskit/code by only supporting a subset of languages. Also introduces support for theming the content via @atlaskit/theme. AK-4536 [eee2d45](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eee2d45)
- [none] Updated dependencies [eee2d45](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eee2d45)
  - @atlaskit/docs@4.2.1

## 5.0.4

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/theme@4.0.4

## 5.0.3

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/docs@4.1.1

## 5.0.2

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2

## 5.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 5.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 4.0.4

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 4.0.3

- [patch] Align font sizes for inline code, mentions and dates [d2ef1af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2ef1af)
- [none] Updated dependencies [d2ef1af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2ef1af)

## 4.0.1

- [patch] Get rid of outdent dependency [6a2c1d9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a2c1d9)

## 4.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 3.1.2

- [patch] Plain text should not be rendered as markdown [fe307dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe307dc)

## 3.1.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 3.1.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 3.0.6

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 3.0.5

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 3.0.4

- [patch] Minor manual bump for packages desync'd from npm [e988c58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e988c58)

## 3.0.3

- Manual bump to resolve desync with npm package version.

## 3.0.2

- [patch] Enabling syntax highlighter language auto-detect [4831bd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4831bd2)

## 3.0.1

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 3.0.0

- [major] Moved to elements repo converted to flow typing, stripped out typescript types [235e392](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/235e392)

## 2.2.1

- [patch] Remove styled-components as a peerDependency from @atlaskit/code. [047032b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/047032b)

## 2.2.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)
