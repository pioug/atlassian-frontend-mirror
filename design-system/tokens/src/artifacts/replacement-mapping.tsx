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
 * @codegen <<SignedSource::3693c84242890a6f6edcca866a473b40>>
 * @codegenCommand yarn build tokens
 */
import type tokens from './token-names';

type Token = keyof typeof tokens | string;
type RenameMap = {
  path: string;
  state: 'experimental' | 'deprecated' | 'deleted';
  replacement?: Token;
}

const replacementMapper: RenameMap[] = [
  {
    "path": "motion.easing.spring",
    "state": "experimental"
  },
  {
    "path": "space.gap.large",
    "state": "experimental",
    "replacement": "space.150"
  },
  {
    "path": "space.gap.medium",
    "state": "experimental",
    "replacement": "space.100"
  },
  {
    "path": "space.gap.small",
    "state": "experimental",
    "replacement": "space.075"
  },
  {
    "path": "space.gap.xlarge",
    "state": "experimental",
    "replacement": "space.200"
  },
  {
    "path": "space.gap.xsmall",
    "state": "experimental",
    "replacement": "space.050"
  },
  {
    "path": "space.gap.xxlarge",
    "state": "experimental",
    "replacement": "space.300"
  },
  {
    "path": "space.gap.xxsmall",
    "state": "experimental",
    "replacement": "space.025"
  }
];

export default replacementMapper;
