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
 * @codegen <<SignedSource::8acffd312a339deeb96c1044b1d8291e>>
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
    "path": "font.ui.[default]",
    "state": "deprecated"
  },
  {
    "path": "font.ui.small",
    "state": "deprecated"
  },
  {
    "path": "font.letterSpacing.0",
    "state": "deprecated"
  },
  {
    "path": "font.letterSpacing.100",
    "state": "deprecated"
  },
  {
    "path": "font.letterSpacing.200",
    "state": "deprecated"
  },
  {
    "path": "font.letterSpacing.300",
    "state": "deprecated"
  },
  {
    "path": "font.letterSpacing.400",
    "state": "deprecated"
  },
  {
    "path": "font.family.body",
    "state": "deprecated"
  },
  {
    "path": "font.family.code",
    "state": "deprecated"
  },
  {
    "path": "font.family.heading",
    "state": "deprecated"
  },
  {
    "path": "font.family.monospace",
    "state": "deprecated"
  },
  {
    "path": "font.family.sans",
    "state": "deprecated"
  },
  {
    "path": "font.size.050",
    "state": "deprecated"
  },
  {
    "path": "font.size.075",
    "state": "deprecated"
  },
  {
    "path": "font.size.100",
    "state": "deprecated"
  },
  {
    "path": "font.size.200",
    "state": "deprecated"
  },
  {
    "path": "font.size.300",
    "state": "deprecated"
  },
  {
    "path": "font.size.400",
    "state": "deprecated"
  },
  {
    "path": "font.size.500",
    "state": "deprecated"
  },
  {
    "path": "font.size.600",
    "state": "deprecated"
  },
  {
    "path": "font.lineHeight.1",
    "state": "deprecated"
  },
  {
    "path": "font.lineHeight.100",
    "state": "deprecated"
  },
  {
    "path": "font.lineHeight.200",
    "state": "deprecated"
  },
  {
    "path": "font.lineHeight.300",
    "state": "deprecated"
  },
  {
    "path": "font.lineHeight.400",
    "state": "deprecated"
  },
  {
    "path": "font.lineHeight.500",
    "state": "deprecated"
  },
  {
    "path": "font.lineHeight.600",
    "state": "deprecated"
  }
];

export default replacementMapper;
