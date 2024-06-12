# Codemods

To easily download and run codemods associated with atlassian-frontend components and services, we
provide a CLI tool called `@atlaskit/codemod-cli`.

The idea is that upgrading major versions can be **assisted** by codemods, reducing upgrade-pain,
improving adoption and giving component authors the flexibility to improve API and component design.

**Note:** Codemods will be designed to do the heavy lifting, but they'll often not be perfect so
some manual work may still be required in order to successfully migrate.

---

## Usage

`$ npx @atlaskit/codemod-cli /project/src/file.js`

## Options

### --preset, -n

Select which transform to run from existing transform list by providing the preset name. This will
allow you run the transfrom without any interaction.

**example:**

- `npx @atlaskit/codemod-cli -n theme-to-design-tokens --extensions tsx,ts,js --parser tsx /project/src`

### --transform, -t

The transform to run, transforms can be either a single file or directory with an index.

**example:**

- `npx @atlaskit/codemod-cli --transform codemods/my-special-mod /project/src/file.js`
- `npx @atlaskit/codemod-cli --transform codemods/my-special-mod/index.ts /project/src/file.js`

### --since-ref <git-ref>

Determines changed packages since the specified git ref and runs all codemods for them. The
automatic version of `--packages`. The ref can be any valid git ref, e.g. a commit hash, HEAD etc.

**example:**

- `npx @atlaskit/codemod-cli --since-ref HEAD /project/src`
- `npx @atlaskit/codemod-cli --since-ref abcdef123 /project/src`

### --packages

Runs transforms for the specified comma separated list of packages, optionally include a version for
each package to run all transforms since that version

**example:**

- `npx @atlaskit/codemod-cli --packages @atlaskit/button /project/src`
- `npx @atlaskit/codemod-cli --packages @atlaskit/button@3.0.0,@atlaskit/range@4.0.0 /project/src`

### --parser, -p

Parser to use for parsing the source files you are code modding.

**options:**

- babel (default)
- babylon
- flow
- ts
- tsx

**example:**

- `npx @atlaskit/codemod-cli --parser tsx /project/src/file.js`
- `npx @atlaskit/codemod-cli -p babel /project/src/file.js`

### --extensions, -e

Transform files with these file extensions (comma separated list) (default: js)

**example:**

- `npx @atlaskit/codemod-cli --extensions ts,tsx /project/src/file.js`
- `npx @atlaskit/codemod-cli -e js /project/src/file.js`

### --ignore-pattern

Ignore files that match a provided glob expression

**example:**

- `@atlaskit/codemod-cli --ignore-pattern node_modules /project/src/file.js`

### --no-filter-paths

The codemod CLI filters supplied file paths by default, improving runtime by preventing codemods
from running in non-dependent packages. Add this flag if there are problems with the filtering
logic.

**example:**

- `npx @atlaskit/codemod-cli --no-filter-paths ./packages`

### --version, -v

Get current version number

**example:**

- `@atlaskit/codemod-cli --version`
- `@atlaskit/codemod-cli -v`

### --help

Print all help text to the command line

**example:**

- `@atlaskit/codemod-cli --help`

### Custom options

All options are passed to the transformer, which means you can supply custom options that are not
listed here.

**examples:**

- `npx @atlaskit/codemod-cli --foo bar /project/src/file.js`

---

## Testing locally

When wanting to run the CLI before it has been published you can run the start command.

```
yarn start [commands]
```

For a list of commands run it with `-h` or refer to the documentation above.

---

## For internal Atlassians

_Internal Atlassians can access
[additional documentation on Confluence](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods)._
