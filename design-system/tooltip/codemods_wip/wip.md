To continue work on the codemod:

- Add `"jscodeshift": "0.14.0",` to devDependncies
- Add `"@atlaskit/codemod-utils": "^4.1.3",` to dependencies
- Change folder from `codemod_wip` to `codemod`
- Add `"./codemods/**/*.ts",` to `include` in `tsconfig`
- Rename all `ts_` file extensions in the codemod folders to `ts`
