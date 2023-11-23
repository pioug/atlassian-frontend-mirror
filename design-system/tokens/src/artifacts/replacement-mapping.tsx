/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * This file is intended to help automate renaming of tokens.
 *
 * 1. Mark the old token's 'state' as deprecated
 * 2. Add a 'replacement' attribute to the token with the value 'my.new.token'
 * 3. Create a new token matching the token above: 'my.new.token'
 * 4. Run 'yarn build tokens' to have you changes reflected in this map
 * 5. ESLint and other tools will now use this to automate replacing tokens
 *
 * These changes will then be picked up by our tooling which will attempt to
 * migrate as many of these renames as possible.
 *
 * @codegen <<SignedSource::97a5e3ceb873d28e0118b88f5dc3e800>>
 * @codegenCommand yarn build tokens
 */
import tokens from './token-names';

type Token = keyof typeof tokens | string;
type RenameMap = {
  path: string;
  state: 'experimental' | 'deprecated' | 'deleted';
  replacement?: Token;
}

const replacementMapper: RenameMap[] = [
  {
    "path": "border.width.0",
    "state": "experimental"
  },
  {
    "path": "font.body.[default]",
    "state": "experimental"
  },
  {
    "path": "font.body.large",
    "state": "experimental"
  },
  {
    "path": "font.body.small",
    "state": "experimental"
  },
  {
    "path": "font.code.[default]",
    "state": "experimental"
  },
  {
    "path": "font.heading.large",
    "state": "experimental"
  },
  {
    "path": "font.heading.medium",
    "state": "experimental"
  },
  {
    "path": "font.heading.small",
    "state": "experimental"
  },
  {
    "path": "font.heading.xlarge",
    "state": "experimental"
  },
  {
    "path": "font.heading.xsmall",
    "state": "experimental"
  },
  {
    "path": "font.heading.xxlarge",
    "state": "experimental"
  },
  {
    "path": "font.heading.xxsmall",
    "state": "experimental"
  },
  {
    "path": "font.ui.[default]",
    "state": "experimental"
  },
  {
    "path": "font.ui.small",
    "state": "experimental"
  },
  {
    "path": "font.family.body",
    "state": "experimental"
  },
  {
    "path": "font.family.code",
    "state": "experimental"
  },
  {
    "path": "font.family.heading",
    "state": "experimental"
  },
  {
    "path": "font.family.brand",
    "state": "experimental"
  }
];

export default replacementMapper;
