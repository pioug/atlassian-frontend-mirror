# @atlaskit/eslint-plugin-volt-strict-mode

## 1.5.4

### Patch Changes

- [`f45ae98257281`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f45ae98257281) -
  Fix shared mutable state detection when parser scopes include a global return wrapper.

## 1.5.3

### Patch Changes

- [`8f77dadf06bcd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8f77dadf06bcd) -
  Exempt modules whose runtime exports directly share mutable module-local state from the
  `no-multiple-exports` rule.

## 1.5.2

### Patch Changes

- [`9159bce7d6dfc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9159bce7d6dfc) -
  `no-multiple-exports`: no longer reports on files the `volt-no-multi-exports` codemod cannot split
  — files where two or more runtime exports share a single module-level `@compiled` style value
  (B3), or share a reassignable `let`/`var` module singleton that at least one export reassigns (B2
  / TS2632). Detection is conservative: a file is only exempt when a single binding is genuinely
  shared across two or more would-be split exports.

## 1.5.1

### Patch Changes

- [`1887b7b42848e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1887b7b42848e) -
  Improve `no-barrel-imports` / `no-migrated-barrel-imports` lint performance by replacing hundreds
  of per-source esquery attribute selectors with plain `ImportDeclaration` /
  `ExportNamedDeclaration` listeners and `barrelSourceMap` lookups. Also covers barrel sources that
  were previously missing from the hand-maintained selector list.

## 1.5.0

### Minor Changes

- [`fb6cc466680b9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fb6cc466680b9) -
  Add no-migrated-barrel-imports error rule for Stage 2 consumersMigrated barrel imports, with
  autofix for lint-on-save

## 1.4.0

### Minor Changes

- [`c4a53493929b3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c4a53493929b3) -
  Record how each entry-point exposes a symbol so rewritten imports resolve.

  Barrels routinely rename what they re-export (`export { default as IconTile }`,
  `export { Props as TextFieldProps }`), so the import form at the barrel was not a reliable guide
  to the import form at the entry-point. Symbol resolution now matches on the name a symbol has
  inside its source module rather than on source-file identity, and the config records
  `isDefaultExport` / `entryPointName` where the entry-point differs from the barrel.

  This corrects mappings that previously pointed at an entry-point which does not export the symbol,
  and stops `no-barrel-imports` / `no-migrated-barrel-imports` rewriting named imports into ones
  that do not resolve. Codegen now fails if any mapped symbol is unreachable from its entry-point in
  the recorded form, including hand-written overrides.

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [`1d2bcee3cebdf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1d2bcee3cebdf) -
  Add no-barrel-imports rule that rewrites known package barrel imports to mapped entry-points from
  @atlaskit/volt-components-entry-point-config

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [`470ef9b6f6a7c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/470ef9b6f6a7c) -
  Exempt root package barrel entry points (`<pkg>/src/index.{ts,tsx,js,jsx}`) from the
  `no-re-exports` and `no-multiple-exports` rules. A package's root barrel is its public API
  surface, so it may re-export freely and aggregate many exports without requiring an `@deprecated`
  migration-shim marker. The exemption is intentionally narrow: nested barrels (e.g.
  `src/components/index.tsx`), non-`index` files under `src`, and `index` files outside a `src`
  directory remain enforced.

## 1.1.2

### Patch Changes

- [`3f29e6e4c2809`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f29e6e4c2809) -
  Align `no-multiple-exports` with the Volt codemod so it no longer reports false positives:
  - Enable `allowPrimitiveExports` in the shipped presets — a file may have one function/class
    export plus any number of primitive value exports (string/number/boolean/etc).
  - Count a default export and a named export of the same identifier
    (`export default Foo; export { Foo };`) as one logical export.
  - Skip aliased re-exports of an already-exported local binding (`export { Foo as Bar }`) — a
    second name for one export, not a new unit.
  - Skip export specifiers that re-expose an imported binding (`import { X }; export { X };`) —
    these are re-exports owned by `no-re-exports`, not local runtime declarations.

  Also (in `platform/eslint.config.cjs`) exempt test and example files (`__tests__`, `*.test.*`,
  `*.spec.*`, `*_testUtils.*`, `examples/`) from the Volt Strict Mode rules, matching the codemod's
  shippable-source scope.

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`2f56c78f969b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2f56c78f969b8) -
  Update i18n NPM package versions for teamwork-graph (Group 16)

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`77e318cfe5e32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/77e318cfe5e32) -
  Initial release of the Volt Strict Mode lint rule package
